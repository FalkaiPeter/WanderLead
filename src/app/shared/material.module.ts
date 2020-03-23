import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatDatepickerModule,
  ],
  exports: [
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatDatepickerModule,
  ]
})
export class MaterialModule { }
