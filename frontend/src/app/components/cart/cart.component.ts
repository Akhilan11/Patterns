import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: any = '';
  isLoading = false;
  orderData = { name: '', address: '', phone: '' };
  addresses: any[] = []; // To hold user addresses
  selectedAddress: any = null; // Hold the selected address object

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.sub;
          this.fetchCartItems();
          this.fetchAddresses();
        }
      },
      error: (err) => console.error('Error fetching user', err)
    });
  }

  fetchAddresses(): void {
    this.addressService.getAddresses(this.userId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        console.log('Fetched Addresses:', this.addresses);

        if (this.addresses.length > 0) {
          alert('Addresses loaded successfully!');
        } else {
          alert('No saved addresses found.');
        }
      },
      error: (err) => console.error('Error fetching addresses', err)
    });
  }

  fetchCartItems(): void {
    this.isLoading = true;
    this.cartService.getCartItems(this.userId).subscribe({
      next: (cart) => {
        this.cartItems = cart.products;
        console.log('Cart Items:', this.cartItems);
      },
      error: (err) => console.error('Error fetching cart', err),
      complete: () => this.isLoading = false
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      return;
    }
    this.cartService.updateCartItem(this.userId, productId, quantity).subscribe({
      next: () => this.fetchCartItems(),
      error: (err) => console.error('Error updating cart item:', err),
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => this.fetchCartItems(),
      error: (err) => console.error('Error removing cart item:', err),
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Use the selected address or the new address entered by the user
    const orderData = {
      userId: this.userId,
      items: this.cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalPrice: this.cartItems.reduce((total, item) => total + item.quantity * item.productId.price, 0),
      name: this.orderData.name,
      address: this.selectedAddress ? this.selectedAddress.addressLine : this.orderData.address, // Use selected or entered address
      phone: this.orderData.phone
    };

    // Save the new address if the user enters a new one
    if (!this.selectedAddress) {
      const newAddress = {
        userId: this.userId,
        name: this.orderData.name,
        addressLine: this.orderData.address,
        phoneNumber: this.orderData.phone
      };

      this.addressService.addAddress(newAddress).subscribe({
        next: (savedAddress) => {
          console.log('New address saved:', savedAddress);
          alert('New address saved successfully!');

          // Proceed with order placement after saving the address
          this.placeOrder(orderData);
        },
        error: (err) => console.error('Error saving new address', err)
      });
    } else {
      // Proceed directly with order placement if a saved address is selected
      this.placeOrder(orderData);
    }
  }

  // Place the order
  placeOrder(orderData: any): void {
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartItems = [];
        this.orderData = { name: '', address: '', phone: '' };
        this.selectedAddress = null; // Reset selected address after checkout
        this.router.navigate(['/orders']);
      },
      error: (err) => console.error('Error placing order', err)
    });
  }

  // Update order data when an address is selected
  onAddressChange(): void {
    if (this.selectedAddress) {
      this.orderData.name = this.selectedAddress.name;
      this.orderData.address = this.selectedAddress.addressLine;
      this.orderData.phone = this.selectedAddress.phoneNumber;
    } else {
      this.orderData = { name: '', address: '', phone: '' }; // Clear fields if no address is selected
    }
  }
}
