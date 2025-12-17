import { inject, Injectable } from '@angular/core';
import { Auth } from '../auth/auth';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Crowdservices {
  crowdUrl = "https://hiring-dev.internal.kloudspot.com/api/analytics/entry-exit"
  auth = inject(Auth);

  constructor(private http : HttpClient){}

  getcrowddata(siteId: string,fromUtc: string,toUtc: string):Observable<any>{
    // console.log("now we reached get data making api calls")
    const token = this.auth.getToken();
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    const body = {
      siteId: siteId,
      fromUtc: fromUtc,
      toUtc: toUtc
    }; 
    return this.http.post(this.crowdUrl, body, { headers: header })


  }
  
}
