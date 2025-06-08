import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  productImage: string;
  category: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 500,
    trim: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 0,
    default: 0 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  productImage: { 
    type: String, 
    required: true,
    trim: true 
  },  category: { 
    type: String, 
    required: true,
    enum: [
      'Jerseys',
      'Sports Shoes',
      'Footballs',
      'Bats'
    ],
    trim: true 
  },
  username: { 
    type: String, 
    required: true,
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model<IProduct>('Product', productSchema);
