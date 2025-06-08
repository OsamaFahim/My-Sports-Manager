import Product, { IProduct } from '../models/Product';

export async function getAllProducts(): Promise<IProduct[]> {
  return Product.find().sort({ createdAt: -1 }).lean();
}

export async function getProductById(id: string): Promise<IProduct | null> {
  return Product.findById(id).lean();
}

export async function getProductsByUser(username: string): Promise<IProduct[]> {
  return Product.find({ username }).sort({ createdAt: -1 }).lean();
}

export async function getProductsByCategory(category: string): Promise<IProduct[]> {
  return Product.find({ category }).sort({ createdAt: -1 }).lean();
}

export async function createProduct(
  username: string,
  data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }
): Promise<IProduct> {
  const product = new Product({ 
    ...data, 
    username,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await product.save();
  return product.toObject();
}

export async function updateProduct(
  id: string,
  username: string,
  data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }
): Promise<IProduct | null> {
  const product = await Product.findById(id);
  if (!product || product.username !== username) return null;
  
  Object.assign(product, data);
  product.updatedAt = new Date();
  await product.save();
  return product.toObject();
}

export async function deleteProduct(
  id: string,
  username: string
): Promise<{ success: boolean }> {
  const product = await Product.findById(id);
  if (!product || product.username !== username) return { success: false };
  
  await Product.findByIdAndDelete(id);
  return { success: true };
}

export async function searchProducts(searchTerm: string): Promise<IProduct[]> {
  const searchRegex = new RegExp(searchTerm, 'i');
  return Product.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ]
  }).sort({ createdAt: -1 }).lean();
}
