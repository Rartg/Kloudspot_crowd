import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { AuthLoginComponent } from './component/loginp/loginp';
import { CrowdEntries } from './component/crowd-entries/crowd-entries';

export const routes: Routes = [
    {path: 'dashboard', component: Dashboard},
    {path: '', component: AuthLoginComponent},
    {path: 'crowd', component: CrowdEntries}
    
];
