import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const [totalCourses, completedCourses, activeCourses, certificates] = await Promise.all([
      prisma.course.count({ where: { userId } }),
      prisma.course.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.course.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.certificate.count({
        where: { course: { userId } },
      }),
    ]);

    const courses = await prisma.course.findMany({
      where: { userId },
      select: { hoursLearned: true },
    });

    const totalHoursLearned = courses.reduce((sum, course) => sum + course.hoursLearned, 0);

    res.json({
      totalCourses,
      completedCourses,
      activeCourses,
      totalCertificates: certificates,
      totalHoursLearned,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Get all courses for the user
    const courses = await prisma.course.findMany({
      where: { userId },
      include: { certificates: true },
    });

    // Monthly stats (last 6 months)
    const monthlyStats = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      const monthCourses = courses.filter((course) => {
        const courseDate = new Date(course.endDate);
        return (
          courseDate.getMonth() === date.getMonth() &&
          courseDate.getFullYear() === date.getFullYear()
        );
      });

      const coursesCompleted = monthCourses.filter((c) => c.status === 'COMPLETED').length;
      const hours = monthCourses.reduce((sum, course) => sum + course.hoursLearned, 0);

      return { month, hours, coursesCompleted };
    }).reverse();

    // Category distribution
    const categoryMap: Map<string, number> = new Map();
    courses.forEach((course) => {
      categoryMap.set(course.category, (categoryMap.get(course.category) || 0) + 1);
    });

    const totalCoursesCount = courses.length || 1; // Avoid division by zero
    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalCoursesCount) * 100),
    }));

    // Dashboard stats
    const dashboardStats = {
      totalCourses: courses.length,
      completedCourses: courses.filter((c) => c.status === 'COMPLETED').length,
      activeCourses: courses.filter((c) => c.status === 'IN_PROGRESS').length,
      totalCertificates: courses.reduce((sum, c) => sum + c.certificates.length, 0),
      totalHoursLearned: courses.reduce((sum, c) => sum + c.hoursLearned, 0),
    };

    res.json({
      monthlyStats,
      categoryDistribution,
      dashboardStats,
    });
  } catch (error) {
    next(error);
  }
};
