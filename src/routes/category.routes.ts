import { Router } from 'express';
import { categoryController } from "../controllers/category.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get('/', categoryController.getAll.bind(categoryController));
router.get('/slug/:slug', categoryController.getBySlug.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), categoryController.create.bind(categoryController));
router.patch('/:id', authenticate, authorize('ADMIN'), categoryController.update.bind(categoryController));
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.delete.bind(categoryController));

export default router;

