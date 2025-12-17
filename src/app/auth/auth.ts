import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class Auth {
   private token: any;
   private apiUrl = 'https://hiring-dev.internal.kloudspot.com/api/auth/login';

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password
    };
    const res = this.http.post(`${this.apiUrl}`, body);
   
    return res;
  }
  
  setToken(token: any){
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(){
    return this.token || localStorage.getItem('authToken');
  }
  removeToken(){
     localStorage.clear();
    this.token = '';
  }
}
