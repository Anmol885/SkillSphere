import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Get existing notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Check for upcoming course deadlines (within 7 days)
    const upcomingCourses = await prisma.course.findMany({
      where: {
        userId,
        status: { in: ['NOT_STARTED', 'IN_PROGRESS'] },
        endDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      },
    });

    // Create notifications for upcoming deadlines if they don't exist
    for (const course of upcomingCourses) {
      const existingNotification = notifications.find(
        (n) => n.message.includes(course.title) && !n.isRead
      );

      if (!existingNotification) {
        const daysUntilDeadline = Math.ceil(
          (course.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        await prisma.notification.create({
          data: {
            userId,
            message: `Course "${course.title}" deadline is in ${daysUntilDeadline} day(s)`,
            type: 'deadline',
          },
        });
      }
    }

    // Fetch all notifications again after creating new ones
    const allNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(allNotifications);
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
    const { id } = req.params;
    const userId = req.user!.userId;

    const notification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};
