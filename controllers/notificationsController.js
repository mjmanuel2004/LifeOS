import Notification from '../models/Notification.js';
import catchAsync from '../utils/catchAsync.js';

export const getUnreadNotifications = catchAsync(async (req, res) => {
    const notifications = await Notification.find({ read: false }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
});

export const markAsRead = catchAsync(async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ status: 'success' });
});

export const clearAll = catchAsync(async (req, res) => {
    await Notification.updateMany({ read: false }, { read: true });
    res.status(200).json({ status: 'success' });
});
