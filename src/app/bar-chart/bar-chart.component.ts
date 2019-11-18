import {Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {ShapeService} from '../shape.service';
import {PopUpService} from '../pop-up.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements AfterViewInit {

  constructor(private shapeService: ShapeService,
              private popupService: PopUpService) {
  }

  private selectedOne: string;
  private selectedTwo: string;
  private map;
  private token = 'pk.eyJ1IjoiMjI2Njk4MGQiLCJhIjoiY2puNjNsYmtlMDB1NTNxcW13bXZ1NWFsaiJ9.XFlV393S5b13Bd5jd1AgnA';
  private localAuthorities;

  private static highlightFeature(e) {
    const layer = e.target;
    layer.openTooltip();
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042',
    });
  }

  private static resetFeature(e) {
    const layer = e.target;
    layer.closeTooltip();
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  private selectFeature(e: any) {
    const layer = e.target;
    if (!this.selectedOne){
      this.selectedOne = layer.feature.properties.LAD13NM;
    } else {
      this.selectedTwo = layer.feature.properties.LAD13NM;
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.shapeService.getLocalAuthorityShapes().subscribe(shapes => {
      this.localAuthorities = shapes;
      this.initLALayer();
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([56.8642, -4.2518], 7);
    const tiles = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${this.token}`, {
      maxZoom: 19,
      id: 'mapbox.satellite',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private initLALayer() {
    const localAuthorityLayer = L.geoJSON(this.localAuthorities, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.bindTooltip(this.popupService.makeTooltip(String(layer.feature.properties.LAD13NM))),
        layer.on({
          click: (e) => (this.selectFeature(e)),
          mouseover: (e) => (BarChartComponent.highlightFeature(e)),
          mouseout: (e) => (BarChartComponent.resetFeature(e)),
        })
      ),
    });
    this.map.addLayer(localAuthorityLayer);
  }
}
