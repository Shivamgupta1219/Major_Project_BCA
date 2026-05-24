import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const unreadCount = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

export const createNotification = async (userId, type, title, message, actionUrl = null, metadata = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      actionUrl,
      metadata,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
