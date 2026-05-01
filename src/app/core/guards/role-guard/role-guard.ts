import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/authService';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthReady()) {
    return false;
  }

  const requiredRole = route.data['role'] as string;
  const appUser = auth.appUser();

  if (!appUser) {
    return router.createUrlTree(['/login']);
  }

  if (appUser.role === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
