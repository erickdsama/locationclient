import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import {Auth} from "../interfaces";
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentJWTSubject: BehaviorSubject<Auth>;
  public currentJWT: Observable<Auth>;

  constructor(private http: HttpClient) {
    this.currentJWTSubject = new BehaviorSubject<Auth>(JSON.parse(localStorage.getItem('token')));
    this.currentJWT = this.currentJWTSubject.asObservable();
  }

  public get currentJWTValue(): Auth {
    return this.currentJWTSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.baseURL}/auth`, { username, password })
      .pipe(map(jwt => {
        localStorage.setItem('token', JSON.stringify(jwt));
        this.currentJWTSubject.next(jwt);
        return jwt;
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.currentJWTSubject.next(null);
  }
}
