import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SharedModule } from '@wl-shared/shared.module';
import { NgAisModule } from 'angular-instantsearch';




@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgAisModule,
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
