import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3500/api/orders'; 

  constructor(private http: HttpClient) { }

  // Create an order
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, orderData);
  }

  // Get all orders for a user
  getOrders(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
  
  // Get all orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Update order status (for admin or shipment purposes)
  updateOrder(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}`, { status });
  }

  // Delete an order (optional, based on your requirements)
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
}
