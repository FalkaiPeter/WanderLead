import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { NgxsModule } from '@ngxs/store';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@environments/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CurrentUserState } from './states/current-user.state';
import { NotificationState } from './states/notifications.state';








@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AngularFireAuthGuardModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxsModule.forRoot([CurrentUserState, NotificationState]), // initial states
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],

})
export class CoreModule { }
