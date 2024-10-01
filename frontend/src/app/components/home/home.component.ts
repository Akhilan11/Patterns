import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user : any;
  products: Product[] = []; // Type products array with Product interface

  constructor(public auth: AuthService, private productService: ProductService, private router : Router) {}

  ngOnInit(): void {
    this.fetchUser();
    this.fetchProducts();
  }

  fetchUser(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        this.user = user;
        console.log('User Info:', user);
      },
      error: (err) => console.error('Error retrieving user info:', err),
    })
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Fetched Products:', products);
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  deleteProduct(id : string) : void {
    this.productService.deleteProduct(id).subscribe({
      next : () => {
        alert("Product deleted successfully");
        this.fetchProducts();
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        alert("Failed to delete product");
      }
    })
  }

  viewProduct(id : string) : void {
    this.router.navigate(['/products',id]);
  }

  viewCart() : void {
    this.router.navigate(['/cart'])
  }

  viewOrders() : void {
    this.router.navigate(['/orders'])
  }

  logout(): void {
    this.auth.logout();
  }

}
