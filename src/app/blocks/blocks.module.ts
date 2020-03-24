import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { NavComponent } from './nav/nav.component';
import { AppComponent } from './root/app.component';
import { ShellComponent } from './shell/shell.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    ShellComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    BlocksRoutingModule
  ]
})
export class BlocksModule { }
