import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile/profile';

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
    path: 'profile',
    component: Profile,
    title: 'Profile',
  },
];
