import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./_services/auth.service";
import {Auth} from "./interfaces/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pruebatecnica';
  jwt: Auth;

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.authenticationService.currentJWT.subscribe(x => this.jwt = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
