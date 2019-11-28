import {Injectable} from '@angular/core';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private drugData;
  private populationData;

  constructor(private dataService
                : DataService) {
    this.dataService.getDrugDeaths().subscribe(data => this.drugData = data);
    this.dataService.getPopulationData().subscribe(data => this.populationData = data);
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
