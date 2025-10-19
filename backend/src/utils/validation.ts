import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
});

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  platform: z.string().min(1, 'Platform is required'),
  category: z.string().min(1, 'Category is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  hoursLearned: z.number().min(0).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  hoursLearned: z.number().min(0).optional(),
});

// User Profile Schema
export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
});
