import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.services';

// import { DASHBOARD_ROUTE } from '../constants/route.constant';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   constructor(
    private $router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const accessToken = localStorage.getItem('token');
      if (accessToken) {
        return true;
      }
        else{
        this.$router.navigate(['/login']);
        return false;
      }
          }
}

