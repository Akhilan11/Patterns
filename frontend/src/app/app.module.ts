import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// modules
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http';

// components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { ViewOrdersComponent } from './components/manufacturer/view-orders/view-orders.component';
import { ReviewComponent } from './components/review/review.component';
import { PaymentComponent } from './components/payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    OrdersComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    ViewOrdersComponent,
    ReviewComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain : 'dev-5lccpay5g127xkuy.us.auth0.com',
      clientId : 'VxsXdGR2RE17SCZdaoonD8khjk7F0xDV',
      authorizationParams : {
        redirect_uri : window.location.origin
      }
    })
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
