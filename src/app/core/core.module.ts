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
import { NgAisModule } from 'angular-instantsearch';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsModule } from '@angular/google-maps';








@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AngularFireAuthGuardModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AgmCoreModule.forRoot({apiKey: environment.firebaseConfig.apiKey, libraries: ['places', 'geometry']}),
    NgAisModule.forRoot(),
    GoogleMapsModule,
    NgxsModule.forRoot([CurrentUserState, NotificationState], { developmentMode: !environment.production }), // initial states
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],

})
export class CoreModule { }
