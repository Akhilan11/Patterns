import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3500/api/reviews';

  constructor(private http: HttpClient) {}

  // Fetch reviews for a product
  getReviews(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  // Add a new review
  addReview(reviewData: any): Observable<any> {
    return this.http.post(this.apiUrl, reviewData);
  }

  // Fetch a review by its ID
  getReviewById(reviewId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${reviewId}`);
  }

  // Update a review by its ID
  updateReview(reviewId: string, reviewData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reviewId}`, reviewData);
  }

  // Delete a review by its ID
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`);
  }
}
