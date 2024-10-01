// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:3500/api/cart'; // Adjust base URL as needed

  constructor(private http: HttpClient) { }

  // Add product to cart
  addToCart(userId: string, productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(this.baseUrl, { userId, productId, quantity });
  }

  // Get cart items by userId
  getCartItems(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  updateCartItem(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/items/${productId}`, { quantity });
  }

  removeCartItem(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/items/${productId}`);
  }
}
