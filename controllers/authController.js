import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import appleSignin from 'apple-signin-auth';

// Create token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Send response with token
const sendTokenResponse = (user, statusCode, res) => {
    const token = signToken(user._id);

    const options = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
        // Send a temporary token to verify 2FA
        const tempToken = jwt.sign({ tempId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.status(200).json({
            success: true,
            requires2FA: true,
            tempToken
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
import crypto from 'crypto';
export const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Réinitialisation de votre mot de passe LifeOS',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('Email could not be sent', 500));
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Generate 2FA Secret and QR Code
// @route   POST /api/auth/2fa/generate
// @access  Private
import * as otplib from 'otplib';
const { authenticator } = otplib;
import qrcode from 'qrcode';

export const generate2FA = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'LifeOS', secret);

    // We save it temporarily, but don't enable it yet until verified
    user.twoFactorSecret = secret;
    await user.save({ validateBeforeSave: false });

    qrcode.toDataURL(otpauth, (err, imageUrl) => {
        if (err) {
            return next(new AppError('Error generating QR code', 500));
        }

        res.status(200).json({
            success: true,
            secret,
            qrCode: imageUrl
        });
    });
});

// @desc    Verify and Enable 2FA
// @route   POST /api/auth/2fa/enable
// @access  Private
export const enable2FA = catchAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new AppError('Please provide a 2FA token', 400));
    }

    const user = await User.findById(req.user.id);

    if (!user.twoFactorSecret) {
        return next(new AppError('2FA not generated yet', 400));
    }

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });

    if (!isValid) {
        return next(new AppError('Invalid 2FA code', 400));
    }

    user.isTwoFactorEnabled = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: '2FA enabled successfully'
    });
});

// @desc    Verify 2FA for Login
// @route   POST /api/auth/login/verify
// @access  Public
export const loginVerify2FA = catchAsync(async (req, res, next) => {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
        return next(new AppError('Please provide token and code', 400));
    }

    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.tempId).select('+twoFactorSecret');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });

        if (!isValid) {
            return next(new AppError('Invalid 2FA code', 400));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        return next(new AppError('Session expired or invalid', 401));
    }
});

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public

export const googleLogin = catchAsync(async (req, res, next) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return next(new AppError('Please provide a Google Access Token', 400));
    }

    // Fetch user info using the access token
    let googleUser;
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        googleUser = await response.json();
    } catch (error) {
        return next(new AppError('Failed to fetch user info from Google', 400));
    }

    if (!googleUser || !googleUser.email) {
        return next(new AppError('Invalid Google Token or No Email provided', 400));
    }

    const { email, name } = googleUser;

    // Find user by email
    let user = await User.findOne({ email }).select('+twoFactorSecret');

    if (!user) {
        // Create user if they don't exist
        const randomPassword = crypto.randomBytes(16).toString('hex');
        user = await User.create({
            name,
            email,
            password: randomPassword // Satisfy the required field
        });
    }

    // Support 2FA for Google Login
    if (user.isTwoFactorEnabled) {
        const tempToken = jwt.sign({ tempId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.status(200).json({
            success: true,
            requires2FA: true,
            tempToken
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    GitHub Login
// @route   POST /api/auth/github
// @access  Public
export const githubLogin = catchAsync(async (req, res, next) => {
    const { code } = req.body;

    if (!code) {
        return next(new AppError('Please provide a GitHub Authorization Code', 400));
    }

    // 1. Exchange the code for an access token
    let accessToken;
    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return next(new AppError(`GitHub OAuth Error: ${tokenData.error_description}`, 400));
        }

        accessToken = tokenData.access_token;
    } catch (error) {
        return next(new AppError('Failed to exchange GitHub token', 400));
    }

    if (!accessToken) {
        return next(new AppError('Failed to retrieve GitHub Access Token', 400));
    }

    // 2. Fetch user profile from GitHub
    let githubUser;
    let githubEmails;
    try {
        // Get user profile
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        githubUser = await userResponse.json();

        // GitHub often keeps emails private, fetch them specifically
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        githubEmails = await emailsResponse.json();
    } catch (error) {
        return next(new AppError('Failed to fetch user info from GitHub', 400));
    }

    // Find primary verified email
    const primaryEmailObj = githubEmails.find(email => email.primary && email.verified);
    const email = primaryEmailObj ? primaryEmailObj.email : githubUser.email;

    if (!email) {
        return next(new AppError('Could not retrieve a verified email from GitHub', 400));
    }

    const name = githubUser.name || githubUser.login;
    const githubId = githubUser.id.toString();
    const avatar = githubUser.avatar_url;

    // 3. Find user by email or githubId
    let user = await User.findOne({
        $or: [{ email }, { githubId }]
    }).select('+twoFactorSecret');

    if (!user) {
        // Create user if they don't exist
        const randomPassword = crypto.randomBytes(16).toString('hex');
        user = await User.create({
            name,
            email,
            githubId,
            avatar,
            password: randomPassword // Satisfy the required field just in case
        });
    } else {
        // Link githubId/avatar if not already linked but email matches
        if (!user.githubId) {
            user.githubId = githubId;
            user.avatar = user.avatar || avatar;
            await user.save({ validateBeforeSave: false });
        }
    }

    // Support 2FA for GitHub Login
    if (user.isTwoFactorEnabled) {
        const tempToken = jwt.sign({ tempId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.status(200).json({
            success: true,
            requires2FA: true,
            tempToken
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Apple Login
// @route   POST /api/auth/apple
// @access  Public
export const appleLogin = catchAsync(async (req, res, next) => {
    const { identityToken, user: appleUserStr } = req.body;

    if (!identityToken) {
        return next(new AppError('Please provide an Apple Identity Token', 400));
    }

    try {
        // Verify the token
        const appleIdTokenClaims = await appleSignin.verifyIdToken(identityToken, {
            // Optional: you can specify audience if you have the client ID
            // audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: true, // You might want to remove this in prod for strict security
        });

        const appleId = appleIdTokenClaims.sub;
        let email = appleIdTokenClaims.email;
        let name = '';

        // On first login, Apple sends the user object (name, email)
        if (appleUserStr) {
            try {
                const appleUser = JSON.parse(appleUserStr);
                if (appleUser.name) {
                    name = `${appleUser.name.firstName || ''} ${appleUser.name.lastName || ''}`.trim();
                }
                if (appleUser.email) {
                    email = appleUser.email;
                }
            } catch (e) {
                console.error("Error parsing Apple User object:", e);
            }
        }

        if (!email) {
            return next(new AppError('No email provided by Apple', 400));
        }

        if (!name) {
            name = email.split('@')[0]; // Fallback name
        }

        let user = await User.findOne({
            $or: [{ email }, { appleId }]
        }).select('+twoFactorSecret');

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name,
                email,
                appleId,
                password: randomPassword
            });
        } else {
            // Link appleId if not existing
            if (!user.appleId) {
                user.appleId = appleId;
                await user.save({ validateBeforeSave: false });
            }
        }

        // Support 2FA for Apple Login
        if (user.isTwoFactorEnabled) {
            const tempToken = jwt.sign({ tempId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
            return res.status(200).json({
                success: true,
                requires2FA: true,
                tempToken
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Apple Login Verification Error:', err);
        return next(new AppError('Invalid Apple Token', 400));
    }
});
