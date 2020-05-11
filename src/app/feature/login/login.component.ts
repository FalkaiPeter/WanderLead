import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@wl-core/auth/authentication.service';
import { RegisterFormComponent } from './register-form/register-form.component';
import { WLValidators, WLErrorStateMatcher } from '@wl-core/validators';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit{
  loginErrorStateMatcher = new WLErrorStateMatcher();
  loginFormGroup: FormGroup;

  constructor(public authservice: AuthenticationService, public dialog: MatDialog, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: new FormControl('', WLValidators.email),
      password: new FormControl('', WLValidators.password),
    })
  }

  openDialog(){
    const dialogRef = this.dialog.open(RegisterFormComponent, {panelClass: 'full-width-dialog'});
    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result !== undefined) {
        this.authservice.signUp(result).catch((error) => {alert(error); });
      }
    });
  }
}
