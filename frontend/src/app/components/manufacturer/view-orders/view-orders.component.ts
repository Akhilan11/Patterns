import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];
  
  // Track the currently editing order's ID
  editingOrderId: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Fetch all orders
  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Fetched Orders:', this.orders);
      },
      error: (err) => console.error('Error fetching orders', err),
    });
  }

  // Enter edit mode for a specific order
  editOrder(orderId: string): void {
    this.editingOrderId = orderId; // Enable edit mode for this order
  }

  // Cancel edit mode
  cancelEdit(): void {
    this.editingOrderId = null; // Exit edit mode
    this.fetchOrders(); // Revert any unsaved changes by re-fetching orders
  }

  // Update order status
  updateOrder(order: any): void {
    this.editingOrderId = null; // Exit edit mode
    this.orderService.updateOrder(order._id, order.status).subscribe({
      next: () => {
        alert('Order status updated successfully');
        this.fetchOrders(); // Refresh the orders after updating status
      },
      error: (err) => console.error('Error updating order status', err),
    });
  }
}
