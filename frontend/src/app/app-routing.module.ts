import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { ViewOrdersComponent } from './components/manufacturer/view-orders/view-orders.component';

const routes: Routes = [
  { path:'', component : HomeComponent },
  { path:'login', component : LoginComponent },
  { path:'products', component : ProductsComponent },
  { path:'products/:id', component : ProductDetailComponent },
  { path:'cart', component : CartComponent },
  { path:'orders', component: OrdersComponent },
  { path:'admin', component: AdminDashboardComponent},
  { path:'admin/products', component: AdminProductsComponent},
  { path:'admin/orders', component:AdminOrdersComponent},
  { path:'manufacturer/orders', component:ViewOrdersComponent },
  { path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
