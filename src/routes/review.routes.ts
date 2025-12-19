import { Router } from 'express';
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticate, reviewController.create.bind(reviewController));
router.patch('/:id', authenticate, reviewController.update.bind(reviewController));
router.delete('/:id', authenticate, reviewController.delete.bind(reviewController));

export default router;

