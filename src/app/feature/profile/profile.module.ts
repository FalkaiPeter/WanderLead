import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from '@wl-core/states/profile.state';
import { SharedModule } from '@wl-shared/shared.module';
import { PlanModule } from '../plan/plan.module';
import { PostModule } from '../post/post.module';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    NgxsModule.forFeature([ProfileState]),
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    PlanModule,
    PostModule
  ]
})
export class ProfileModule { }
