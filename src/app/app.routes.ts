import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { StaffViewOrders } from './components/staff-view-orders/staff-view-orders';
import { roleGuard } from './core/guards/role-guard/role-guard';
import { AboutPage } from './components/about-page/about-page';
import { ContactPage } from './components/contact-page/contact-page';
import { Profile } from './components/profile/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home', //done
  },
  {
    path: 'login',
    component: Login,
    title: 'Login', //done
  },
  {
    path: 'register',
    component: Register,
    title: 'Register', //done
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
    title: 'About', //done
  },
  {
    path: 'contact',
    component: ContactPage,
    title: 'Contact', //done
  },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile', //done
  },
];
