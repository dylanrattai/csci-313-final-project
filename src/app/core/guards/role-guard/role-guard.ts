import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/authService';

export const roleGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  while (!auth.isAuthReady()) {
    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  const requiredRole = route.data['role'] as string;
  const appUser = auth.appUser();

  if (!appUser) {
    return router.createUrlTree(['/login']);
  }

  if (requiredRole?.includes(appUser.role)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
