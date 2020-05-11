import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WLErrorStateMatcher, WLRepeatPasswordEStateMatcher, WLValidators, WLRepeatPasswordValidator } from '@wl-core/validators';




@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  matcher = new WLErrorStateMatcher();
  passwordMatcher = new WLRepeatPasswordEStateMatcher();
  form: any;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<RegisterFormComponent>) {
    this.form = this.formBuilder.group ( {
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', WLValidators.email),
      password: new FormControl('', WLValidators.password),
      passwordAgain: new FormControl(''),
      acceptTerms: new FormControl('', [Validators.requiredTrue])
    }, { validator: WLRepeatPasswordValidator });
  }

  submitAccount(form: FormGroup){
    this.dialogRef.close(form.value);
  }


  ngOnInit() {
  }

}
