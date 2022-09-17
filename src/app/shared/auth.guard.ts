import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private snack: MatSnackBar) {

  }
  canActivate() {
    if(sessionStorage.getItem('user')) {
      return true;
    }
    this.router.navigate(['/login']);
    this.snack.open(" Entre ou Crie uma conta ", undefined, {duration: 4000,  panelClass: ['red-snackbar']});
    return false;
  }
  
}
