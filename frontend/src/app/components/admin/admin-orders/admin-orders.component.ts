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
  totalOrderAmount: number = 0;  // Store total amount of all orders
  totalOrders: number = 0;  // Total number of orders
  pendingOrders: number = 0;  // Number of pending orders
  shippedOrders: number = 0;  // Number of shipped orders
  deliveredOrders: number = 0;  // Number of delivered orders

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Fetch all orders
  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateOrderStatistics();  // Calculate all statistics after fetching orders
      },
      error: (err) => console.error('Error fetching orders', err),
    });
  }

  // Calculate the total amount, and count orders by status
  calculateOrderStatistics(): void {
    this.totalOrderAmount = this.orders.reduce((acc, order) => acc + order.totalPrice, 0);
    this.totalOrders = this.orders.length;
    this.pendingOrders = this.orders.filter(order => order.status === 'pending').length;
    this.shippedOrders = this.orders.filter(order => order.status === 'shipped').length;
    this.deliveredOrders = this.orders.filter(order => order.status === 'delivered').length;
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
    this.orderService.updateOrderStatus(order._id, order.status).subscribe({
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
