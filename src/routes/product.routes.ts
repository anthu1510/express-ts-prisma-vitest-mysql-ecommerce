import { Router } from 'express';
import { productController } from "../controllers/product.controller";
import { reviewController } from "../controllers/review.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get('/', productController.getAll.bind(productController));
router.get('/slug/:slug', productController.getBySlug.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.get('/:productId/reviews', reviewController.getProductReviews.bind(reviewController));

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), productController.create.bind(productController));
router.patch('/:id', authenticate, authorize('ADMIN'), productController.update.bind(productController));
router.delete('/:id', authenticate, authorize('ADMIN'), productController.delete.bind(productController));

export default router;

