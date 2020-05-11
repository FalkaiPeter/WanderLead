import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';


export class WLRepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('password').value !== control.parent.get('passwordAgain').value && control.dirty);
  }
}


/* REPEAT PASSWORD VALIDATOR */
export function WLRepeatPasswordValidator(group: FormGroup) {
  const password = group.controls.password.value;
  const passwordConfirmation = group.controls.passwordAgain.value;
  return password === passwordConfirmation ? null : { passwordsNotEqual: true }
}

export namespace WLValidators {
  export const name = [Validators.required, Validators.maxLength(24), Validators.minLength(2)];
  export const password = [Validators.required, Validators.minLength(6)];
  export const email = [Validators.required, Validators.email];

}

export class WLErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
