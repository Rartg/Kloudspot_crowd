import { Component, inject } from '@angular/core';

import { Router, RouterModule} from '@angular/router';
import { Auth } from '../../auth/auth';
import { Vars } from '../../services/vars';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  vars = inject(Vars)
  router = inject(Router)
  auth = inject(Auth)
  logout(){
    this.auth.removeToken();
    this.vars.removevars();
    this.router.navigate(['/'])

  }

}
