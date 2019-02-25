import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerCreateComponent } from './player-create/player-create.component';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
    {
        path: '',
        component: PlayerComponent

    },
    {
        path: 'player-create',
        component: PlayerCreateComponent,
        data: { title: 'Create player' }
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
