import { Routes } from '@angular/router';

const Routing: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
