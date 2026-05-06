import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { StaffViewOrders } from './components/employee/staff-view-orders/staff-view-orders';
import { roleGuard } from './core/guards/role-guard/role-guard';

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
];
