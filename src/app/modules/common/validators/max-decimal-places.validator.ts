import { AbstractControl, ValidatorFn } from '@angular/forms';

// Walidator dla maksymalnie dwóch miejsc po przecinku
export function maxDecimalPlaces(maxPlaces: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null; // Brak wartości

    const decimalPart = value.toString().split('.')[1] || '';
    if (decimalPart.length > maxPlaces) {
      return { 'maxDecimalPlaces': { value: control.value } };
    }
    return null;
  };
}