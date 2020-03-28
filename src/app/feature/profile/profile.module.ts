import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@wl-core/states/profile.state';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    NgxsModule.forFeature([ProfileState]),
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
