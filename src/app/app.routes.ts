import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/profile-components/login/login';
import { Register } from './components/profile-components/register/register';
import { StaffViewOrders } from './components/employee-components/staff-view-orders/staff-view-orders';
import { roleGuard } from './core/guards/role-guard/role-guard';
import { AboutPage } from './components/about-page/about-page';
import { ContactPage } from './components/contact-page/contact-page';
import { Profile } from './components/profile-components/profile/profile/profile';
import { CustomizationPage } from './components/cake-customization/customization-page/customization-page';
import { Checkout } from './components/checkout/checkout';
import { PremadeMenu } from './components/premade-menu/premade-menu';
import { AdminViewOrders } from './components/admin-components/admin-view-orders/admin-view-orders';
import { AdminManage } from './components/admin-components/admin-manage/admin-manage';
import { authGuard } from './core/guards/auth-guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home',
  },
  {
    path: 'about',
    component: AboutPage,
    title: 'About' 
  },
    {
    path: 'contact',
    component: ContactPage,
    title: 'Contact' 
  },
  {
    path: 'menu',
    component: PremadeMenu,
    title: 'Menu',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile',
    canActivate: [authGuard]
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
  {
    path: 'admin-manage',
    component: AdminManage,
    title: 'Admin Manage',
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'custom-cake',
    component: CustomizationPage,
    title: 'Customize Your Cake',
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: Checkout,
    title: 'Checkout',
    canActivate: [authGuard],
  },
];
