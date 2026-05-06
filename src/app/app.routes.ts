import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/profile-components/login/login';
import { Register } from './components/profile-components/register/register';
import { StaffViewOrders } from './components/employee-components/staff-view-orders/staff-view-orders';
import { roleGuard } from './core/guards/role-guard/role-guard';
import { AdminViewOrders } from './components/admin-components/admin-view-orders/admin-view-orders';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login',
  },
  {
    path: 'register',
    component: Register,
    title: 'Register',
  },
  {
    path: 'staff-view-orders',
    component: StaffViewOrders,
    title: 'View Orders',
    canActivate: [roleGuard],
    data: { role: 'employee' },
  },
  {
    path: 'admin-view-orders',
    component: AdminViewOrders,
    title: 'Admin View Orders',
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
];
