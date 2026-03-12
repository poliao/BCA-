import { Component, Input } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { finalize, Observable } from 'rxjs';
import { BaseFormField } from '../base-form';
import { LookupSource } from './lookup.source';


@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html'
})
export class LookupComponent extends BaseFormField {

  @Input() content!: ComponentType<unknown>;
  @Input() source!: LookupSource;
  @Input() onOpen: (value: any) => Observable<any>;
  searching = false;
  term: string = '';

  override writeValue(value: string): void {
    this.value = value;
    this.term = value;
  }

  open(): void {
    this.onOpen(this.term).subscribe(result => {
      if (result) {
        this.source.setLoadedDatas(result);
        let value = result[this.source.bindValue];
        this.writeValue(value);
        this.onChange(this.value);
      }
      else if (this.value !== this.term) {
        this.writeValue(null);
        this.onChange(this.value);
      }
    })
  }

  onTextChange($event: Event): void {
    this.term = ($event.target as HTMLInputElement).value;
    if (this.term) {
      this.searching = true;
      this.source.getData(this.term).pipe(
        finalize(() => this.searching = false)
      ).subscribe(result => {
        if (result?.length === 1) {
          const key = result[0][this.source.bindValue];
          this.writeValue(key);
          this.onChange(this.value);
        }
        else {
          this.open();
        }
      })
    }
    else {
      this.writeValue(null);
      this.onChange(this.value);
    }
  }
}
