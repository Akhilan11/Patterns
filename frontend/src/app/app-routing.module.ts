import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path:'', component : HomeComponent },
  { path:'login', component : LoginComponent },
  { path:'products', component : ProductsComponent },
  { path:'products/:id', component : ProductDetailComponent },
  { path:'cart', component : CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
