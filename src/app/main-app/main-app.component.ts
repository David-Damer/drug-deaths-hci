import {Component, AfterViewInit, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {DataService} from '../data.service';
import {PopUpService} from '../pop-up.service';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss']
})
export class MainAppComponent implements AfterViewInit, OnInit {

  constructor(private dataService: DataService,
              private popupService: PopUpService) {
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {xAxes: [{}], yAxes: [{}]},
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  public barChartLabels: Label[] = ['All', 'Heroin/morphine 2', 'Methadone', 'Heroin/Methadone/Buprenorphine', 'Codeine', 'Dihydrocodeine'
    , 'Opiates', 'Benzodiazepines', 'Gabapentin/Pregabalin', 'Cocaine', 'Ecstacy', 'Amphetamines', 'Alcohol'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  private selectedOne: string;
  private selectedTwo: string;
  private map;
  private token = 'pk.eyJ1IjoiMjI2Njk4MGQiLCJhIjoiY2puNjNsYmtlMDB1NTNxcW13bXZ1NWFsaiJ9.XFlV393S5b13Bd5jd1AgnA';
  private localAuthorities;
  private showDetails = true;
  private showCompare = false;
  private drugData;
  private tableData;
  private displayedColumns: string[] = ['drugs', 'deaths'];
  private heading: string;

  private static highlightFeature(e) {
    const layer = e.target;
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
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  ngOnInit(): void {
    this.dataService.getDrugDeaths().subscribe(data => {
        this.drugData = data;
        this.initialiseChartData();
      },
    );
  }

  private toggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.showCompare = !this.showCompare;
  }

  private selectFeature(e: any) {
    const layer = e.target;
    if (!this.selectedOne) {
      this.selectedOne = layer.feature.properties.LAD13NM;
    } else {
      this.selectedTwo = layer.feature.properties.LAD13NM;
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.dataService.getLocalAuthorityShapes().subscribe(shapes => {
      this.localAuthorities = shapes;
      this.initLALayer();
      this.showTable('Scotland');
    });
  }

  private initialiseChartData() {
    this.barChartData.pop();
    for (const val of Object.keys(this.drugData)) {
      const dataObj = {label: val, data: [], borderColor: 'red', fill: true};
      const data = [];
      for (const item of this.drugData[val]) {
        data.push(parseInt(item.deaths, 10));
      }
      console.log(data);
      dataObj.data = data;
      this.barChartData.push(dataObj);
    }
  }

  private showTable(region: string): void {
    this.tableData = this.drugData[region];
    this.heading = region;
  }


  private initMap(): void {
    this.map = L.map('map').setView([56.8642, -4.2518], 7);
    const tiles = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${this.token}`, {
      maxZoom: 8,
      minZoom: 6,
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
        layer.on({
          mouseover: (e) => (MainAppComponent.highlightFeature(e),
            this.showTable(feature.properties.LAD13NM)),
          mouseout: (e) => (MainAppComponent.resetFeature(e),
            this.showTable('Scotland')),
        })
      ),
    });
    this.map.addLayer(localAuthorityLayer);
  }
}
