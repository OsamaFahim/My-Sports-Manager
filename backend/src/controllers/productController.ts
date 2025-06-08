import { Request, Response } from 'express';
import * as productService from '../services/productService';

// GET /api/products
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, user } = req.query;
    
    let products;
    if (search) {
      products = await productService.searchProducts(search as string);
    } else if (category) {
      products = await productService.getProductsByCategory(category as string);
    } else if (user) {
      products = await productService.getProductsByUser(user as string);
    } else {
      products = await productService.getAllProducts();
    }
    
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

// GET /api/products/:id
export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
}

// POST /api/products (protected)
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const username = (req as any).user?.username;
    const { name, description, quantity, price, productImage, category } = req.body;
    
    if (!username || !name || !description || quantity === undefined || price === undefined || !productImage || !category) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Validate price and quantity are positive numbers
    if (price < 0 || quantity < 0) {
      res.status(400).json({ message: 'Price and quantity must be non-negative' });
      return;
    }

    const product = await productService.createProduct(username, {
      name,
      description,
      quantity: Number(quantity),
      price: Number(price),
      productImage,
      category
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

// PUT /api/products/:id (protected)
export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const username = (req as any).user?.username;
    const { id } = req.params;
    const { name, description, quantity, price, productImage, category } = req.body;
    
    if (!username || !name || !description || quantity === undefined || price === undefined || !productImage || !category) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Validate price and quantity are positive numbers
    if (price < 0 || quantity < 0) {
      res.status(400).json({ message: 'Price and quantity must be non-negative' });
      return;
    }

    const updated = await productService.updateProduct(id, username, {
      name,
      description,
      quantity: Number(quantity),
      price: Number(price),
      productImage,
      category
    });
    
    if (!updated) {
      res.status(403).json({ message: 'Forbidden or product not found' });
      return;
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
}

// DELETE /api/products/:id (protected)
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const username = (req as any).user?.username;
    const { id } = req.params;
    
    if (!username) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const result = await productService.deleteProduct(id, username);
    if (!result.success) {
      res.status(403).json({ message: 'Forbidden or product not found' });
      return;
    }
    
    res.json(result);
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}
