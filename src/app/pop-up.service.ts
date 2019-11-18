import {Injectable} from '@angular/core';
import {ShapeService} from './shape.service';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private drugData;
  private populationData;

  constructor(private shapeService: ShapeService) {
    this.shapeService.getDrugDeaths().subscribe(data => this.drugData = data);
    this.shapeService.getPopulationData().subscribe(data => this.populationData = data);
  }

  makeTooltip(data: any): string {
    const regionData = this.drugData[data];
    let regionDataString = `<div>Region: ${data}</div>\n`;
    for (const val of Object.keys(regionData)) {
      regionDataString = regionDataString + `<div>${val}: ${regionData[val]}</div>`;
    }
    return regionDataString;
  }
}
