import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PostModule } from '../post/post.module';
import { PostCreatorModule } from '../post-creator/post-creator.module';
import { MaterialModule } from '@wl-shared/material.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PostModule,
    PostCreatorModule,
    MaterialModule
  ]
})
export class HomeModule { }
