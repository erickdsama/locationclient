import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Vehicle} from "../interfaces/vehicle";
import {environment} from "@env/environment";
import {Auth} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    if (error.status == 404){
      errorMessage = "No se encontraron resultados"
    }
    return throwError(errorMessage);
  }

  private currentVehicleSubject: BehaviorSubject<Vehicle>;
  public currentVehicle: Observable<Vehicle>;
  private userJWT: any;

  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };
  constructor(private http: HttpClient) {
    this.currentVehicleSubject = new BehaviorSubject<Vehicle>(null);
    this.currentVehicle = this.currentVehicleSubject.asObservable();
    let datatoken = JSON.parse(localStorage.getItem('token'));
    let jwt = datatoken["jwt"];
    let jwtData = this.parseJwt(jwt);
    this.userJWT = jwtData.identity;
    console.log(this.userJWT);

  }

  getVehicleByUser() {
    return this.http.get<any>(`${environment.baseURL}/get_my_vehicles`)
      .pipe(
        map(vehicle => {
        return vehicle;
      }),
      catchError(this.handleError)
      )
    }
  addVehicle(vin, plate) {
    return this.http.post<any>(`${environment.baseURL}/vehicle`, {
      vin, plate, user_id: this.userJWT.id
    })
      .pipe(map(vehicle => {
        return vehicle;
      }));
  }
  getVehicleLocation(vehicle_id) {
    return this.http.get<any>( `${environment.baseURL}/vehicle/${vehicle_id}/last-location`)
      .pipe(map(location => {
        return location;
      }), catchError(this.handleError)
      );
  }
}
