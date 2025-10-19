import { Router } from 'express';
import * as coursesController from '../controllers/courses.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses for the authenticated user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', coursesController.getAllCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
router.get('/:id', coursesController.getCourseById);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               platform:
 *                 type: string
 *               category:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', upload.single('certificate'), coursesController.createCourse);

router.put('/:id', upload.single('certificate'), coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);
router.patch('/:id/complete', coursesController.markCourseCompleted);

export default router;
