import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  
  orders: any[] = [];
  editingOrderId: string | null = null;  // Track currently editing order

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Fetch all orders
  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => console.error('Error fetching orders', err),
    });
  }

  // Edit order status
  editOrder(orderId: string): void {
    this.editingOrderId = orderId;
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingOrderId = null;
    this.fetchOrders();  // Re-fetch to discard unsaved changes
  }

  // Save order status update
  saveOrder(order: any): void {
    this.orderService.updateOrder(order._id, order.status).subscribe({
      next: () => {
        alert('Order status updated successfully');
        this.editingOrderId = null;  // Exit edit mode
        this.fetchOrders();  // Refresh the list
      },
      error: (err) => console.error('Error updating order status', err),
    });
  }

  // Cancel an order
  cancelOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        alert('Order cancelled successfully');
        this.fetchOrders();  // Refresh orders after cancellation
      },
      error: (err) => console.error('Error cancelling order', err),
    });
  }

}
