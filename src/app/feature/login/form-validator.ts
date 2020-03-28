import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';


/* ERROR MATCHER FOR LOGIN */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
/* EMAIL */
export const EmailValidation = [Validators.required, Validators.email];

/* PASSWORD */
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(24),
];
/* REPEAT PASSWORD ERROR MATCHER */
export class RepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('password').value !== control.parent.get('passwordAgain').value && control.dirty);
  }
}

/* REPEAT PASSWORD VALIDATOR */
export function RepeatPasswordValidator(group: FormGroup) {
  const password = group.controls.password.value;
  const passwordConfirmation = group.controls.passwordAgain.value;
  return password === passwordConfirmation ? null : { passwordsNotEqual: true }
}

