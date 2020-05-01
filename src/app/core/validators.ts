import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';


export class WLRepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('password').value !== control.parent.get('passwordAgain').value && control.dirty);
  }
}

export namespace WLValidators {
  export const name = [Validators.required, Validators.maxLength(24), Validators.minLength(2)];
  export const password = [Validators.required, Validators.maxLength(24), Validators.minLength(2)];
  export const email = [Validators.required, Validators.email];

}

export class WLErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
