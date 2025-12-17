import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from '../auth/auth';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root',
})
@Injectable()
export class DashboardServices {
  auth = inject(Auth);
  urlDwell = "https://hiring-dev.internal.kloudspot.com/api/analytics/dwell"
  urlLoadsites = "https://hiring-dev.internal.kloudspot.com/api/sites"
  urlFootfall = "https://hiring-dev.internal.kloudspot.com/api/analytics/footfall"
  
 
  
  constructor(private http : HttpClient){}

  loadSites(): Observable<any> {
    const token = this.auth.getToken();
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(this.urlLoadsites,{ headers: header });

  }


  
  loadDwellTime(fromUtc: string, toUtc: string, siteId: string): Observable<any> {
    const token = this.auth.getToken();
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const body = {
      siteId: siteId,
      fromUtc: fromUtc,
      toUtc: toUtc
    };    
    return this.http.post(this.urlDwell, body, { headers: header });
  }





  
  loadFootfallData(fromUtc: string, toUtc: string, siteId: string): Observable<any> {
    const token = this.auth.getToken();
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      siteId: siteId,
      fromUtc: fromUtc,
      toUtc: toUtc
    };    
    return this.http.post(this.urlFootfall, body, { headers: header });   
  }




    

  
  
}
