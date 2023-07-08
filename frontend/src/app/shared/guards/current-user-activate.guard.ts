import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserActivate {
  canActivate(
    authService: AuthService,
    router: Router,
    userId: string,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (authService.loggedInUser?.id !== userId) {
      router.navigate(['']);
    }
    return true;
  }
}

export const canActivateCurrentUser: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  return inject(CurrentUserActivate).canActivate(inject(AuthService), inject(Router), route.params['id']);
};
