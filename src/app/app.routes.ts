import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { StaffViewOrders } from './components/staff-view-orders/staff-view-orders';
import { roleGuard } from './core/guards/role-guard/role-guard';
import { AboutPage } from './components/about-page/about-page';
import { ContactPage } from './components/contact-page/contact-page';
import { Profile } from './components/profile/profile/profile';
import { CustomizationPage } from './components/cake-customization/customization-page/customization-page';
import { Checkout } from './components/checkout/checkout';

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
    path: 'about',
    component: AboutPage,
    title: 'About',
  },
  {
    path: 'contact',
    component: ContactPage,
    title: 'Contact',
  },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile',
  },
  {
    path: 'custom-cake',
    component: CustomizationPage,
    title: 'Customize Your Cake',
  },
  {
    path: 'checkout',
    component: Checkout,
    title: 'Checkout',
  },
];
