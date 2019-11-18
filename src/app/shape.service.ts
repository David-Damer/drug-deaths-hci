import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(private http: HttpClient) {
  }

  getLocalAuthorityShapes(): Observable<any> {
    return this.http.get('assets/data/lad.json');
  }

  getDrugDeaths(): Observable<any> {
    return this.http.get('assets/data/drugdeaths.json');
  }

  getPopulationData(): Observable<any> {
    return this.http.get('assets/data/populationData.json');
  }
}
