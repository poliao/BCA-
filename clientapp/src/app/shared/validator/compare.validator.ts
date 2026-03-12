import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

export function compareValidator(compareWith: string, compareType: 'min' | 'max' | 'equal'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const controlToCompare = control.root.get(compareWith);

    if (!value || !controlToCompare) {
      return null;
    }

    let result = null;
    const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
      control.markAsTouched();
      control.updateValueAndValidity({ emitEvent: false });
      subscription.unsubscribe();
    });

    if (controlToCompare.value != null && control.value != null) {
      switch (compareType) {
        case 'min':
          result = controlToCompare.value > control.value ? { 'compareMin': { min: controlToCompare.value } } : null;
          break;
        case 'max':
          result = controlToCompare.value < control.value ? { 'compareMax': { max: controlToCompare.value } } : null;
          break;
        case 'equal':
          result = controlToCompare.value !== control.value ? { 'compareEqual': true } : null;
          break;
      }
    }
    return result;
  }
}