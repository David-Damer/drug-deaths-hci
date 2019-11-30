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
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontSize: 6,
        usePointStyle: true,
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {xAxes: [{}], yAxes: [{}]},
  };
  public barChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  public barChartLabels: Label[] = ['All', 'Heroin/morphine 2', 'Methadone', 'Heroin/Methadone/Buprenorphine', 'Codeine', 'Dihydrocodeine'
    , 'Opiates', 'Benzodiazepines', 'Gabapentin/Pregabalin', 'Cocaine', 'Ecstacy', 'Amphetamines', 'Alcohol'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  private map;
  private token = 'pk.eyJ1IjoiMjI2Njk4MGQiLCJhIjoiY2puNjNsYmtlMDB1NTNxcW13bXZ1NWFsaiJ9.XFlV393S5b13Bd5jd1AgnA';
  private localAuthorities;
  private drugData;
  private tableData;
  private displayedColumns: string[] = ['drugs', 'deaths'];
  private heading: string;
  private colours = ['#000000', '#080000', '#100000', '#180000', '#200000', '#280000', '#300000', '#380000', '#400000', '#480000',
    '#500000', '#580000', '#600000', '#680000', '#700000', '#780000', '#800000', '#880000', '#900000', '#980000', '#A00000', '#A80000',
    '#B00000', '#B80000', '#C00000', '#C80000', '#D00000', '#D80000', '#E00000', '#E80000', '#F00000', '#F80000', '#FF0000'];
  private details = true;
  private detailsString = 'toggle_off';
  private firstSelected = '';
  private secondSelected = '';

  private static highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#FF0000',
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

  private clearSelected(): void {
    this.firstSelected = '';
    this.secondSelected = '';
  }

  private toggleDetails(): void {
    this.details = !this.details;
    if (this.details) {
      this.detailsString = 'toggle_off';
    } else {
      this.detailsString = 'toggle_on';
    }
  }

  ngOnInit(): void {
    this.dataService.getDrugDeaths().subscribe(data => {
        this.drugData = data;
        this.initialiseChartData();
      },
    );
  }


  private selectFeature(e: any) {
    const layer = e.target;
    if (!this.firstSelected) {
      this.firstSelected = layer.feature.properties.LAD13NM;
    } else {
      this.secondSelected = layer.feature.properties.LAD13NM;
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
      const dataObj = {label: val, data: [], borderColor: '#008f68', fill: true, backgroundColor: '#008f68'};
      const data = [];
      for (const item of this.drugData[val]) {
        data.push(parseInt(item.deaths, 10));
      }
      dataObj.data = data;
      this.barChartData.push(dataObj);
    }
  }

  private showTable(region: string): void {
    if (!this.firstSelected) {
      this.tableData = this.drugData[region];
      this.heading = region;
    }
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
          click: (e) => (this.selectFeature(e)),
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
