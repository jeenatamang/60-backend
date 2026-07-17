import express from 'express';
import {
  getAll,
  getOne,
  getByCategory,
  create,
  update,
  remove,
  stats,
  addHeroProduct,
  removeHeroProduct,
  toggleCrueltyFree,
  productAnalytics
} from '../controllers/brand.controller.js';

const router = express.Router();

router.get('/stats', stats);
router.get('/product-analytics', productAnalytics);
router.get('/category/:category', getByCategory);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/cruelty-free', toggleCrueltyFree);
router.post('/:id/products', addHeroProduct);
router.delete('/:id/products/:product_id', removeHeroProduct);
router.delete('/:id', remove);

export default router;