import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MyErrorStateMatcher } from './form-validator';
import { AuthenticationService } from '@wl-core/auth/authentication.service';
import { RegisterFormComponent } from './register-form/register-form.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  matcher = new MyErrorStateMatcher();
  loginFormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]);

  constructor(public authservice: AuthenticationService, public dialog: MatDialog) { }

  openDialog(){
    const dialogRef = this.dialog.open(RegisterFormComponent, {panelClass: 'full-width-dialog'});
    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result !== undefined) {
        console.log(`dialog data: ${result}`)
        this.authservice.signUp(result).catch((error) => {alert(error); });
      }
    });
  }
}
