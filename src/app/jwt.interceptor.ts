import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./_services/auth.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentJWT = this.authenticationService.currentJWTValue;
    if (currentJWT && currentJWT.jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentJWT.jwt}`
        }
      });
    }
    return next.handle(request);
  }
}
