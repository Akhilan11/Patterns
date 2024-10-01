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
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
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
