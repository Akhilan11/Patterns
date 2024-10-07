import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';
import { ReviewService } from '../../services/review.service'; // Import Review Service

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: any;
  user: any;
  reviews: any[] = []; // Array to store fetched reviews
  reviewData = { rating: 0, comment: '' }; // Review input model
  userId: any = ''; // Store the logged-in user's ID
  editMode: boolean = false; // Track if we are editing a review
  currentReviewId: string = ''; // Store ID of the review being edited

  constructor(
    private router: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private reviewService: ReviewService // Inject Review Service
  ) {}

  ngOnInit() {
    this.fetchProduct();
    this.fetchReviews(); // Fetch reviews when the component is initialized

    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.userId = user.sub; // Store user ID from Auth0
      }
    });
  }

  fetchProduct(): void {
    const id = this.router.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
        }
      });
    }
  }

  fetchReviews(): void {
    const id = this.router.snapshot.paramMap.get('id');

    if (id) {
      this.reviewService.getReviews(id).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (err) => {
          console.error('Error fetching reviews:', err);
        }
      });
    }
  }

  addToCart(): void {
    if (this.product.quantity <= 0) {
      alert('This product is out of stock and cannot be added to the cart.');
      return;
    }

    if (this.user) {
      const userId = this.user.sub; // Assuming Auth0 user info
      const productId = this.product._id;
      this.cartService.addToCart(userId, productId).subscribe({
        next: () => alert('Product added to cart!'),
        error: (err) => console.error('Error adding product to cart:', err)
      });
    } else {
      alert('Please log in to add items to the cart');
    }
  }

  addReview(): void {
    const reviewData = {
      productId: this.product._id,
      userId: this.user.sub, // User ID from Auth0
      username: this.user.name || this.user.nickname || 'Anonymous', // Display name from Auth0
      rating: this.reviewData.rating,
      comment: this.reviewData.comment
    };

    if (this.editMode) {
      // Update existing review
      this.reviewService.updateReview(this.currentReviewId, reviewData).subscribe({
        next: (updatedReview) => {
          this.reviews = this.reviews.map(review => 
            review._id === this.currentReviewId ? updatedReview : review
          );
          this.resetReviewForm();
          alert('Review updated successfully!');
        },
        error: (err) => console.error('Error updating review:', err)
      });
    } else {
      // Add new review
      this.reviewService.addReview(reviewData).subscribe({
        next: (newReview) => {
          this.reviews.push(newReview); // Update reviews list
          this.resetReviewForm();
          alert('Review added successfully!');
        },
        error: (err) => console.error('Error adding review:', err)
      });
    }
  }

  // Function to reset the review form
  resetReviewForm(): void {
    this.reviewData = { rating: 0, comment: '' };
    this.editMode = false;
    this.currentReviewId = '';
  }

  // Load existing review data into the form for editing
  editReview(review: any): void {
    this.reviewData.rating = review.rating;
    this.reviewData.comment = review.comment;
    this.currentReviewId = review._id;
    this.editMode = true; // Enable edit mode
  }

  // Delete a review
  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(review => review._id !== reviewId); // Remove from the list
          alert('Review deleted successfully!');
        },
        error: (err) => console.error('Error deleting review:', err)
      });
    }
  }
}
