import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { Observable, Subject, concat, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { BaseFormField } from '../base-form';
import { TypeaheadSource } from './typeahead.source';

@Component({
  selector: 'typeahead',
  templateUrl: './typeahead.component.html'
})
export class TypeaheadComponent extends BaseFormField {
  @Input() bindLabel = "text";
  @Input() bindValue = "value";
  @Input() bindDesc = "description";
  @Input() showDescription = false;
  @Input() source: TypeaheadSource;
  @Input() minSearchTerm = 0;
  items: Observable<any[]>;
  appendTo = 'Body';
  loading = false;
  typeAhead = new Subject<string>();
  openState = new Subject<void>();
  selectedText: string;
  
  @ContentChild('labelTemp') labelTemp!: TemplateRef<any>;
  @ContentChild('optionTemp') optionTemp!: TemplateRef<any>;

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : 'label.ALL.PleaseSelectAuto';
    this.setSelectedText();
  }

  ngOnDestroy(): void {
    this.source.clearCacheItems();
  }

  override writeValue(value: number | string): void {
    this.value = value;
    this.source.clearItems(this.value);
    this.loadData();
  }

  trackByFn(item: any): any {
    return item[this.bindValue];
  }

  onSelected(event: string | number): void {
    this.onChange(event);
    this.value = event;
    this.setSelectedText();
  }

  onOpen(): void {
    this.openState.next();
  }

  private loadData(): void {
    this.loading = true;
    this.items = concat(
      this.source.getModel(this.value as number | string).pipe(
        map(item => {
          this.source.addItemToCache(item);
          return Array.from([item]);
        }),
        finalize(() => this.loading = false)
      ),
      merge(
        this.openState.pipe(
          tap(() => this.loading = true),
          switchMap(() => concat(of([]), this.source.getData(null).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.loading = false)
          )))
        ),
        this.typeAhead.pipe(
          debounceTime(400),
          tap(term => {
            this.onTouched();
            if (this.minSearchTerm > 0) {
              if (term && term.length < this.minSearchTerm) {
                this.addErrors({ minSearchTerm: true }, this.control);
              }
              else {
                this.removeErrors(['minSearchTerm'], this.control);
                this.control?.updateValueAndValidity();
              }
            }
          }),
          distinctUntilChanged(),
          filter(term => term && term.length >= this.minSearchTerm),
          tap(() => this.loading = true),
          switchMap(term => this.source.getData(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.loading = false)
          ))
        )
      )
    );
  }

  setSelectedText(): void {
    this.source.getModel(this.value as number | string).pipe(
      map(item => item.text)
    ).subscribe(text => this.selectedText = text ?? '-');
  }
}

