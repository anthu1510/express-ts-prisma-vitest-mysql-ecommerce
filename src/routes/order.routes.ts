import { Router } from 'express';
import { orderController } from "../controllers/order.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', orderController.getAll.bind(orderController));
router.get('/:id', orderController.getById.bind(orderController));
router.post('/', orderController.create.bind(orderController));
router.post('/:id/cancel', orderController.cancel.bind(orderController));

// Admin only
router.patch('/:id/status', authorize('ADMIN'), orderController.updateStatus.bind(orderController));

export default router;

