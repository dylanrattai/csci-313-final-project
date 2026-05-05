import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { AboutPage } from './components/about-page/about-page';
import { ContactPage } from './components/contact-page/contact-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home',
  },
  {
    path:'about',
    component: AboutPage,
    title: 'About'
  },
    {
    path:'contact',
    component: ContactPage,
    title: 'Contact'
  },
];
