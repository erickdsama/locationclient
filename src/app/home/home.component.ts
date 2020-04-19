import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {VehiclesService} from "../_services/vehicles.service";
import {MapComponent} from "./map/map.component";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  error = false;
  error_location = false;
  loading = false;
  vehicleForm: FormGroup;
  vehicles = [];
  location;
  closeResult = '';
  submitted: boolean;
  @ViewChild(MapComponent, {}) mapComp: MapComponent;
  success: String;

  constructor(
    private vehicleService: VehiclesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  loadLocation(vehicle_id) {
    this.error_location = null;
    if (vehicle_id !== 'null') {
      this.vehicleService.getVehicleLocation(vehicle_id)
        .pipe(first())
        .subscribe(
          data => {
            this.location = data;
            this.mapComp.setMapMarker(this.location.longitude, this.location.latitude, vehicle_id, this.location.time_created);
          },
          error => {
            console.log('error code'+ error);
            this.error_location = error;
            this.loading = false;
          });
    }
  }

  get f() { return this.vehicleForm.controls; }

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      plate: ['', Validators.required],
      vin: ['', Validators.required]
    });
    this.vehicleService.getVehicleByUser()
      .pipe(first())
      .subscribe(
        data => {
          this.vehicles = data["vehicles"]
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }
    this.loading = true;
    this.vehicleService.addVehicle(this.f.vin.value, this.f.plate.value)
      .pipe(first())
      .subscribe(
        data => {
          this.vehicles.push(data);
          this.loading = false;
          this.vehicleForm.reset();
          this.success = "Vehiculo guardado"
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
