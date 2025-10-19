import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

// Notifications feature not yet implemented in database
// This is a placeholder for future implementation

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Return empty notifications for now
    res.json({
      notifications: [],
      unreadCount: 0,
      total: 0,
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ message: 'Notification feature coming soon' });
  } catch (error) {
    next(error);
  }
};
