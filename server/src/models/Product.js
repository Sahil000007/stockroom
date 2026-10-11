import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  sku: { type: String, required: true, trim: true, uppercase: true, unique: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
  description: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
