import { Router } from 'express';
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile.bind(userController));
router.patch('/profile', userController.updateProfile.bind(userController));

// Address routes
router.get('/addresses', userController.getAddresses.bind(userController));
router.post('/addresses', userController.createAddress.bind(userController));
router.patch('/addresses/:addressId', userController.updateAddress.bind(userController));
router.delete('/addresses/:addressId', userController.deleteAddress.bind(userController));

export default router;

