import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatMomentDateModule } from '@angular/material-moment-adapter';







@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatMomentDateModule
  ],
  exports: [
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatMomentDateModule
  ]
})
export class MaterialModule { }
