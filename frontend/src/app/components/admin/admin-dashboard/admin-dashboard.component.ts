import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  totalOrderAmount: number = 0;
  totalOrders: number = 0;
  pendingOrders: number = 0;
  shippedOrders: number = 0;
  deliveredOrders: number = 0;

  constructor(private orderService: OrderService, private router : Router) { }

  ngOnInit(): void {
    this.fetchOrderStatistics();
  }

  // Fetch order statistics
  fetchOrderStatistics(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrderAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        this.totalOrders = orders.length;
        this.pendingOrders = orders.filter(order => order.status === 'pending').length;
        this.shippedOrders = orders.filter(order => order.status === 'shipped').length;
        this.deliveredOrders = orders.filter(order => order.status === 'delivered').length;
      },
      error: (err) => console.error('Error fetching order statistics', err),
    });
  }

  goToOrders(){
    this.router.navigate(['/admin/orders'])
  }

  goToProducts(){
    this.router.navigate(['/admin/products'])
  }

}
