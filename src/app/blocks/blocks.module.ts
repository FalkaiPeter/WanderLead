import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { NavComponent } from './nav/nav.component';
import { AppComponent } from './root/app.component';
import { ShellComponent } from './shell/shell.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationComponent } from './nav/notification/notification.component';
import { SharedModule } from '@wl-shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { SearchModule } from '../feature/search/search.module';


@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    ShellComponent,
    NotFoundComponent,
    NotificationComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BlocksRoutingModule,
    SharedModule,
    SearchModule
  ]
})
export class BlocksModule { }
