import { inject, Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Auth } from '../auth/auth';
import { Vars } from './vars';

@Injectable({
  providedIn: 'root',
})
export class Socketservices {
    private socket: Socket;

  
  liveOccupancy = signal<any>(null);
alerts = signal<any[]>([]);
  auth = inject(Auth)

  constructor() {
    this.socket = io('https://hiring-dev.internal.kloudspot.com', {
      transports: ['websocket'],
      auth: {
      token: this.auth.getToken(),
    }
    });

    this.listenToLiveOccupancy();
    this.listenToAlerts();
  }


  vars = inject(Vars)

  private listenToLiveOccupancy() {
     this.socket.on('live_occupancy', (data: any) => {
      const selectedSite = this.vars.siteId;

      if (!selectedSite) {
        this.liveOccupancy.set(0);
        return;
      }

      if (data.siteId === selectedSite) {
        // console.log('data of live occ:', data);
        this.liveOccupancy.set(data);
      } else {
        
      }
  })
  }










    private listenToAlerts() {
    this.socket.on('alert', (alert: any) => {
      

      
      if (alert.siteId && alert.siteId !== this.vars.siteId) {
        return;
      }

      
      this.alerts.set(
        [alert, ...this.alerts()].slice(0, 20)
      );


      // console.log('Alert', this.alerts());
    });
  }





  





  disconnect() {
    this.socket.disconnect();
  }
  
}
