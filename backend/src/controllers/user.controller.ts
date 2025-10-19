import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { updateProfileSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Get total certificates
    const totalCertificates = await prisma.certificate.count({
      where: { course: { userId } },
    });

    // Mock achievements (you can implement your own logic)
    const completedCourses = await prisma.course.count({
      where: { userId, status: 'completed' },
    });

    const achievements: string[] = [];
    if (completedCourses >= 1) achievements.push('First Course Completed');
    if (completedCourses >= 5) achievements.push('5 Courses Milestone');
    if (completedCourses >= 10) achievements.push('Dedicated Learner');
    if (totalCertificates >= 5) achievements.push('Certificate Collector');

    res.json({
      ...user,
      totalCertificates,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validated = updateProfileSchema.parse(req.body);

    const updateData: any = {};
    if (validated.name) updateData.name = validated.name;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
