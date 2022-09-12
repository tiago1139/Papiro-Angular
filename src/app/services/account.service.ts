import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user') || '{}'));
      this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
      return this.userSubject.value;
  }

  async login(username: any, password: any): Promise<any> {
    let temp : User;
    this.getByName(username).subscribe(u => {
      temp = u;
      if(temp && temp.password == password) {
        if(temp.username == 'admin') {
          sessionStorage.setItem('admin', 'admin');
        }
        sessionStorage.setItem('user', JSON.stringify(u));
        this.userSubject.next(u);
        window.location.href = '';
        return true;

      } else {
        return false;
      }
    });
    

  }

  logout() {
      // remove user from local storage and set current user to null
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('admin');
      //this.userSubject.next(null);
      this.router.navigate(['/login']);
  }

  register(user: User) {
      console.log("REGISTADO")
      return this.http.post(`${environment.apiUrl}/users`, user);
  }

  getAll(): Observable<User[]> {
    
    return this.http.get<User[]>(`${environment.apiUrl}/users`)
    .pipe(tap(users => console.log(users)));
  }

  getById(id: string) {
      return this.http.get<User>(`${environment.apiUrl}/users/id/${id}`);
  }

  getByName(name: string): Observable<User> {
    
    return this.http.get<User>(`${environment.apiUrl}/users/name/${name}`);
  }


  delete(id: string) {
      return this.http.delete(`${environment.apiUrl}/users/id/${id}`)
          .pipe(map(x => {
              // auto logout if the logged in user deleted their own record
              if (id == this.userValue._id) {
                  this.logout();
              }
              return x;
          }));
  } 
}
