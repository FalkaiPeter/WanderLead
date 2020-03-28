import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '@wl-shared/shared.module';
import { RegisterFormComponent } from './register-form/register-form.component';


@NgModule({
  declarations: [LoginComponent, RegisterFormComponent],
  entryComponents: [RegisterFormComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
  ]
})
export class LoginModule { }
