import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class Graphservices {
  occupancyUrl = "https://hiring-dev.internal.kloudspot.com/api/analytics/occupancy"
  demofgraphUrl = "https://hiring-dev.internal.kloudspot.com/api/analytics/demographics"

  constructor(private http : HttpClient, private auth: Auth){}

    loadOccupancyData(fromUtc: string, toUtc: string, siteId: string): Observable<any> {
    const token = this.auth.getToken();
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      siteId: siteId,
      fromUtc: fromUtc,
      toUtc: toUtc
    };    
    return this.http.post(this.occupancyUrl, body, { headers: header });   
  }


  
    loadDemographicData(fromUtc: string, toUtc: string, siteId: string): Observable<any> {
    const token = this.auth.getToken();
    const header = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`
    });
    const body = {
      siteId: siteId,
      fromUtc: fromUtc,
      toUtc: toUtc
    };    
    return this.http.post(this.demofgraphUrl, body, { headers: header });   
  }
  
}
