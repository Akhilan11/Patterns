import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  userId: any = null;

  constructor(private orderService: OrderService, public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.sub;
          this.fetchOrders();
        }
      },
      error: (err) => console.error('Error fetching user', err)
    });
  }

  fetchOrders(): void {
    this.orderService.getOrders(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Fetched Orders:', this.orders);
      },
      error: (err) => console.error('Error fetching orders', err),
    });
  }

  cancelOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        alert('Order cancelled successfully');
        this.fetchOrders(); // Refresh the orders after cancellation
      },
      error: (err) => console.error('Error cancelling order', err),
    });
  }
}
