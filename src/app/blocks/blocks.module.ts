import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { NavComponent } from './nav/nav.component';
import { AppComponent } from './root/app.component';
import { ShellComponent } from './shell/shell.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationComponent } from './nav/notification/notification.component';
import { SearchComponent } from './nav/search/search.component';
import { SharedModule } from '@wl-shared/shared.module';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    ShellComponent,
    NotFoundComponent,
    NotificationComponent,
    SearchComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BlocksRoutingModule,
    SharedModule
  ]
})
export class BlocksModule { }
