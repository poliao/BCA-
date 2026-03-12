import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum PermissionFormMode {
    ReadOnly = "ReadOnly",
    Editable = "Editable",
}

@Injectable({ providedIn: 'root' })
export class FormUtilService {
    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    focusInvalid(el: Element) {
        const invalidElements = el.querySelectorAll('.ng-invalid');
        if (invalidElements.length > 0) {
            invalidElements[0].scrollIntoView(false);
        }
    }


    //hidden from dropdownlist 
    getActive(originals: any[], baseValue: any): any[] {
        let items = [];
        if (baseValue) {
            items = originals.reduce((result, row) => {
                if (row.active || baseValue == row.value) {
                    result.push(row);
                }
                return result;
            }, [])
        }
        else {
            items = originals.reduce((result, row) => {
                if (row.active) {
                    result.push(row);
                }
                return result;
            }, [])
        }
        return items;
    }

    getActives(originals: any[], basesValue: any[] = []) {
        let items = [];

        items = originals.reduce((result, row) => {
            if (row.active || basesValue.some(value => value == row.value)) {
                result.push(row);
            }
            return result;
        }, [])
        return items;
    }

    getModel(value: any, list: any[], bindValue: string = 'value'): any {
        if (!list || list.length === 0) return []
        return list.find(item => item[bindValue] === value) || {};
    }

    getModelAsync(value: any, list: Observable<Array<any>>, bindValue: string = 'value'): Observable<any> {
        return list.pipe(
            map(items => {
                if (!items || items.length === 0) return {};
                return items.find(item => item[bindValue] === value) || {};
            })
        )
    }

    setFormMode(formGroup: FormGroup, formMode: PermissionFormMode) {
        Object.keys(formGroup.controls).forEach(key => {
            let control = formGroup.get(key);
            if(control instanceof FormArray) {
                let forms = control;
                forms.controls.forEach(x => {
                    if(x instanceof FormGroup){
                        this.setFormMode(x, formMode);
                    } else if (x instanceof FormControl){
                        this.setFormControlMode(x, formMode);
                    }
                });
            } else if (control instanceof FormGroup) {
                let formGroup = control;
                this.setFormMode(formGroup, formMode);
            } else {
                this.setFormControlMode(control, formMode);
            }
        });
    }

    setReadOnly(formControl: FormControl & { editField: ElementRef, viewField: ElementRef, initilizeCallback: Function }){
        if (formControl && formControl.viewField) {
            formControl.viewField.nativeElement.classList.remove("field-hidden");
            formControl.viewField.nativeElement.classList.add("field-show");
        }

        if (formControl && formControl.editField) {
            formControl.editField.nativeElement.classList.remove("field-show");
            formControl.editField.nativeElement.classList.add("field-hidden");
        }
    }

    setEditable(formControl: FormControl & { editField: ElementRef, viewField: ElementRef, initilizeCallback: Function }){
        if (formControl && formControl.viewField) {
            formControl.viewField.nativeElement.classList.remove("field-show");
            formControl.viewField.nativeElement.classList.add("field-hidden");
        }

        if (formControl && formControl.editField) {
            formControl.editField.nativeElement.classList.remove("field-hidden");
            formControl.editField.nativeElement.classList.add("field-show");
        }
    }

    setFormControlMode(control: AbstractControl, formMode: PermissionFormMode) {
        let formField = control as FormControl & { editField: ElementRef, viewField: ElementRef, initilizeCallback: Function };
        if (formMode == PermissionFormMode.ReadOnly) {
            if(formField && formField.editField && formField.viewField) {
                this.setReadOnly(formField);
            } else {
                formField.initilizeCallback = (formControl) => {
                    this.setReadOnly(formControl);
                }    
            }
        } else if (formMode == PermissionFormMode.Editable) {
            if(formField && formField.editField && formField.viewField) {
                this.setEditable(formField);
            } else {
                formField.initilizeCallback = (formControl) => {
                    this.setEditable(formControl);
                }    
            }
        }
    }
}
