import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define the email options
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // Optional HTML formatting
        html: options.html ? options.html : `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-w-2xl; background-color: white; padding: 2rem; border-radius: 8px;">
                    <h2 style="color: #333;">LifeOS Notification</h2>
                    <p>${options.message.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
