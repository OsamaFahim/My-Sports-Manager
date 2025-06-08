import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as productController from '../controllers/productController';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}

// Public routes
router.get('/', wrap(productController.getProducts));
router.get('/:id', wrap(productController.getProduct));

// Protected routes (require authentication)
router.use(authenticateJWT);

router.post('/', wrap(productController.createProduct));
router.put('/:id', wrap(productController.updateProduct));
router.delete('/:id', wrap(productController.deleteProduct));

export default router;
