import { Component, Input } from '@angular/core';

import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

import { BaseFormField } from '../../base-form';
import { Content } from '../content-upload.service';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent extends BaseFormField {
  @Input() max = 10240;
  @Input() accept: string = '.txt';

  contentSub!: BehaviorSubject<any>;
  content!: Observable<Content | Partial<Content>>;
  errorMessages: { message: string, param?: { [key: string]: Object } }[] = [];

  constructor(
  ) {
    super();
    this.contentSub = new BehaviorSubject<any>(null);
    this.content = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "object" && source?.import)
          return this.import(source.file);
        if (typeof (source) == "string")
          return of({ name: source } as Partial<Content>);
        return of({ name: source?.name } as Partial<Content>);
      }));
  }

  override writeValue(file?: File): void {
    this.value = file;
    this.contentSub.next(this.value);
  }

  private validate(file: File): boolean {
    this.errorMessages = [];
    let invalid = false;

    const acceptTypes = this.accept.split(",");
    const accpetTypeRegex = acceptTypes.map(type => "\\" + type).join('|');
    const type = file.name;
    let regex = new RegExp(`(${accpetTypeRegex})$`);

    if (acceptTypes.length > 0 && !regex.exec(type)) {
      this.errorMessages.push({ message: 'message.STD00033', param: { type: this.accept } });
      invalid = true;
    }

    if (file.size === 0) {
      this.errorMessages.push({ message: 'message.STD00031' });
      invalid = true;
    }

    if (Math.round((file.size / 1024)) > this.max) {
      this.errorMessages.push({ message: 'message.STD00032', param: { max: this.max / 1024 } });
      invalid = true;
    }

    return invalid;
  }

  choose(input: HTMLInputElement): void {
    this.onTouched();
    input.click();
  }

  add(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files.length === 0) {
      return;
    }

    this.remove();
    const file = input.files[0];

    if (this.validate(file)) {
      input.value = null;
      return;
    }

    this.contentSub.next(file.name);
    this.contentSub.next({ file: file, import: true });
    input.value = null;
  }

  private import(file: File): Observable<Content | Partial<Content>> {
    this.value = file;
    this.onChange(this.value);
    this.onTouched();
    return of({ name: file?.name } as Partial<Content>);
  }

  remove(): void {
    this.onTouched();
    this.value = null;
    this.contentSub.next(this.value);
    this.onChange(this.value);
  }
}
