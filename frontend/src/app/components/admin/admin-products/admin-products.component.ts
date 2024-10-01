import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/admin/product.service';
import { Product } from '../../../models/product.model';

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
  // newProduct: Product = {
  //   imageUrl: '',
  //   name: '',
  //   description: '',
  //   price: 0,
  //   category: ''
  // };

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
      this.productService.deleteProduct(id).subscribe(() => {
        this.fetchProducts(); // Refresh the product list
      });
    }
  }

  // Enter edit mode for a specific product
  editProduct(productId: string): void {
    this.editingProductId = productId; // Enable edit mode for this product
  }

  // Update product
  updateProduct(product: Product): void {
    this.editingProductId = null; // Exit edit mode
    this.productService.updateProduct(product._id, product).subscribe(() => {
      this.fetchProducts(); // Refresh the product list after updating
    });
  }

  // Add new product
  // addProduct(): void {
  //   this.productService.addProduct(this.newProduct).subscribe({
  //     next: () => {
  //       // After adding the product, fetch the updated list
  //       this.fetchProducts();
        
  //       // Clear the newProduct model to reset the form
  //       this.newProduct = {
  //         imageUrl: '',
  //         name: '',
  //         description: '',
  //         price: 0,
  //         category: ''
  //       };
  //     },
  //     error: (err) => {
  //       console.error('Error adding product:', err);
  //     }
  //   });
  // }


}
