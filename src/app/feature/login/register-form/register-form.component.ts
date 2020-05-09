import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
  MyErrorStateMatcher,
  EmailValidation,
  PasswordValidation,
  RepeatPasswordEStateMatcher,
  RepeatPasswordValidator } from '../form-validator';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';




@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  passwordMatcher = new RepeatPasswordEStateMatcher;
  form: any;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<RegisterFormComponent>) {
    this.form = this.formBuilder.group ( {
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      passwordAgain: new FormControl(''),
      acceptTerms: new FormControl('', [Validators.requiredTrue])
    }, { validator: RepeatPasswordValidator });
  }

  submitAccount(form: FormGroup){
    this.dialogRef.close(form.value);
  }


  ngOnInit() {
  }

}
