import { Component, OnInit } from '@angular/core';
import {MapService} from "../../_services/map.service";
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapGl: mapboxgl.Map;
  currentMarker: mapboxgl.Marker;
  constructor(private map: MapService ) { }

  ngOnInit() {
    this.mapGl = this.map.buildMap( null,31.638173, -106.426264);
  }
  cleanMap() {
    this.currentMarker.remove()
  }
  setMapMarker(lng, lat, titulo, description) {
    var el = document.createElement('div');
    el.className = 'marker';
    if (this.currentMarker) {
      this.cleanMap();
    }
    this.mapGl.setCenter(new mapboxgl.LngLat(lng, lat));
    this.currentMarker = new mapboxgl.Marker(el)
      .setLngLat(new mapboxgl.LngLat(parseFloat(lng), parseFloat(lat)))
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + titulo + '</h3><p>' + description + '</p>'))
      .addTo(this.mapGl);
  }
}
