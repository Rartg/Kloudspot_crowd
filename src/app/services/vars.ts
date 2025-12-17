import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Vars {
   siteId: string = '';
   fromUtc: string = '';
   toUtc: string = '';
   removevars(){
    this.siteId = ''
    this.fromUtc =''
    this.toUtc = ''
   }
}
