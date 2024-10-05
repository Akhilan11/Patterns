// product-detail.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: any;
  user: any;

  constructor(
    private router: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.fetchProduct();
    this.auth.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
  }

  fetchProduct(): void {
    const id = this.router.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
        }
      });
    }
  }

  addToCart(): void {
    if (this.product.quantity <= 0) {
      alert('This product is out of stock and cannot be added to the cart.');
      return;
    }

    if (this.user) {
      const userId = this.user.sub; // Assuming Auth0 user info
      const productId = this.product._id;
      this.cartService.addToCart(userId, productId).subscribe({
        next: () => alert('Product added to cart!'),
        error: (err) => console.error('Error adding product to cart:', err)
      });
    } else {
      alert('Please log in to add items to the cart');
    }
  }
}
