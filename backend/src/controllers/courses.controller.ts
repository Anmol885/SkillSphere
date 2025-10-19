import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { createCourseSchema, updateCourseSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

export const getAllCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const courses = await prisma.course.findMany({
      where: { userId },
      include: {
        certificates: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const course = await prisma.course.findFirst({
      where: { id: parseInt(id), userId },
      include: {
        certificates: true,
      },
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validated = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: {
        userId,
        title: validated.title,
        platform: validated.platform,
        category: validated.category,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        status: validated.status || 'ongoing',
        progress: validated.progress || 0,
        hoursLearned: validated.hoursLearned || 0,
      },
      include: {
        certificates: true,
      },
    });

    // Handle certificate upload if provided
    if (req.file) {
      await prisma.certificate.create({
        data: {
          courseId: course.id,
          fileUrl: `/uploads/${req.file.filename}`,
        },
      });
    }

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const validated = updateCourseSchema.parse(req.body);

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingCourse) {
      throw new AppError('Course not found', 404);
    }

    const updateData: any = {};
    if (validated.title) updateData.title = validated.title;
    if (validated.platform) updateData.platform = validated.platform;
    if (validated.category) updateData.category = validated.category;
    if (validated.startDate) updateData.startDate = new Date(validated.startDate);
    if (validated.endDate) updateData.endDate = new Date(validated.endDate);
    if (validated.status) updateData.status = validated.status;
    if (validated.progress !== undefined) updateData.progress = validated.progress;
    if (validated.hoursLearned !== undefined) updateData.hoursLearned = validated.hoursLearned;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        certificates: true,
      },
    });

    // Handle certificate upload if provided
    if (req.file) {
      await prisma.certificate.create({
        data: {
          courseId: course.id,
          fileUrl: `/uploads/${req.file.filename}`,
        },
      });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingCourse) {
      throw new AppError('Course not found', 404);
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const markCourseCompleted = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const course = await prisma.course.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        progress: 100,
      },
      include: {
        certificates: true,
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
