import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Vehicle} from "../interfaces/vehicle";
import {environment} from "@env/environment";

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

  constructor(private http: HttpClient) {
    this.currentVehicleSubject = new BehaviorSubject<Vehicle>(null);
    this.currentVehicle = this.currentVehicleSubject.asObservable();
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
      vin, plate, user_id:1
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
