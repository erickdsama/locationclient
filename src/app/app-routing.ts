import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JwtGuard } from './jwt.guard';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [JwtGuard] },
  { path: 'login', component: LoginComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
export const AppRouting = RouterModule.forRoot(routes);
