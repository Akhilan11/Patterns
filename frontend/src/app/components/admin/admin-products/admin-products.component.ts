import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/admin/product.service';
import { NewProduct, Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  
  // Track the currently editing product's ID
  editingProductId: string | null = null;

  // New product model for adding a product
  newProduct: NewProduct = {
    imageUrl: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    quantity: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  // Fetch all products
  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // Delete product
  deleteProduct(id: string): void {
    const confirmed = confirm("Are you sure you want to delete?");
    if (confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.fetchProducts(); // Refresh the product list
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  // Enter edit mode for a specific product
  editProduct(productId: string): void {
    this.editingProductId = productId; // Enable edit mode for this product
  }

  // Update product
  updateProduct(product: Product): void {
    if (!product._id) {
      console.error('Product ID is missing');
      return;
    }
    
    this.editingProductId = null; // Exit edit mode
    this.productService.updateProduct(product._id, product).subscribe({
      next: () => {
        this.fetchProducts(); // Refresh the product list after updating
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }

// Add new product
addProduct(): void {
  const productToAdd: NewProduct = {
    imageUrl: this.newProduct.imageUrl,
    name: this.newProduct.name,
    description: this.newProduct.description,
    price: this.newProduct.price,
    category: this.newProduct.category,
    quantity: this.newProduct.quantity // Make sure quantity is included
  };

  this.productService.addProduct(productToAdd).subscribe({
    next: () => {
      this.fetchProducts(); // Fetch updated list after adding
      this.resetNewProduct(); // Clear the new product model
      alert("Item added successfully..");
    },
    error: (err) => {
      console.error('Error adding product:', err);
    }
  });
}

  

  // Reset new product model
  resetNewProduct(): void {
    this.newProduct = {
      imageUrl: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      quantity:0
    };
  }
}
