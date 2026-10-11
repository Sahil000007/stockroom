import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();
const validId = (id) => mongoose.isValidObjectId(id);

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid product id.' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid product id.' });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid product id.' });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
