import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
class UnauthorizedCheck {
  canActivate(
    authService: AuthService,
    router: Router
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!authService.accessToken) {
      router.navigate(['auth/login']);
    }
    return true;
  }
}

export const canActivateUnauthorized: CanActivateFn = () => {
  return inject(UnauthorizedCheck).canActivate(inject(AuthService), inject(Router));
};
