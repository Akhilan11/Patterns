import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: any = null;

  constructor(private cartService: CartService,private orderService: OrderService, public auth: AuthService,private router : Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.sub; 
          this.fetchCartItems();
        }
      },
      error: (err) => console.error('Error fetching user', err)
    });
  }

  fetchCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (cart) => {
        this.cartItems = cart.products;
        console.log('Cart Items:', this.cartItems);
      },
      error: (err) => console.error('Error fetching cart', err),
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      return; // Prevent updating to a quantity less than 1
    }

    this.cartService.updateCartItem(this.userId, productId, quantity).subscribe({
      next: () => {
        this.fetchCartItems(); // Refresh the cart items after update
        console.log('Cart updated successfully');
      },
      error: (err) => console.error('Error updating cart item:', err),
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => {
        this.fetchCartItems(); // Refresh the cart items after removal
        console.log('Item removed from cart successfully');
      },
      error: (err) => console.error('Error removing cart item:', err),
    });
  }

  checkout(): void {
    const orderData = {
      userId: this.userId,
      items: this.cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalPrice: this.cartItems.reduce((total, item) => total + item.quantity * item.productId.price, 0)
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        alert('Order placed successfully!');
        this.cartItems = []; // Clear the cart after placing the order
      },
      error: (err) => console.error('Error placing order', err)
    });

    alert("proceeding to checkout");
    this.router.navigate(['/orders'])
  }
  
}
