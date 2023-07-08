import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
class AuthorizedCheck {
  canActivate(
    authService: AuthService,
    router: Router
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (authService.accessToken) {
      router.navigate(['']);
    }
    return true;
  }
}

export const canActivateAuthorized: CanActivateFn = () => {
  return inject(AuthorizedCheck).canActivate(inject(AuthService), inject(Router));
};
