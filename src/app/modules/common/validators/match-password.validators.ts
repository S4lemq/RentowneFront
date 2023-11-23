import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const matchpassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
   const password = control.get('password');
   const repeatPassword = control.get('repeatPassword');
 
   if (password && repeatPassword && password.value !== repeatPassword.value) {
     repeatPassword.setErrors({ passwordMatchError: true });
   } else {
     repeatPassword?.setErrors(null);
   }
 
   return null;
 };
 