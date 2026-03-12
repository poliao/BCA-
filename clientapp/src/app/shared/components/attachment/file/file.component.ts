import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { BaseFormField } from '../../base-form';
import { Category } from '../category';
import { Content, ContentUploadService, Type } from '../content-upload.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent extends BaseFormField {
  @Input() category!: Category;
  @Input() max = 3072;
  @Input() accept: string = '.txt,.png'

  contentSub!: BehaviorSubject<any>;
  content!: Observable<Content | Partial<Content>>;
  uploading = false;
  progress?: number;
  errorMessages: { message: string, param?: any }[] = [];

  constructor(public cs: ContentUploadService) {
    super();
    this.contentSub = new BehaviorSubject<any>(null);
    this.content = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "number")
          return this.cs.getContent(source);
        if (typeof (source) == "object" && source?.upload)
          return this.upload(source.file);
        if (typeof (source) == "string")
          return of({ name: source } as Partial<Content>);
        return of({} as Partial<Content>);
      }));
  }

  override writeValue(id?: number): void {
    this.value = id;
    this.contentSub.next(this.value);
  }

  validate(file: File): boolean {
    this.errorMessages = [];
    let invalid = false;

    const acceptTypes = this.accept.split(",");
    const accpetTypeRegex = acceptTypes.map(type => "\\" + type).join('|')
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
    if (input.files.length === 0) {
      return;
    }

    this.remove();
    const file = input.files[0];

    if (this.validate(file)) {
      input.value = null;
      return;
    }

    this.contentSub.next(file.name);
    this.contentSub.next({ file: file, upload: true });
    input.value = null;
  }

  upload(file: File): Observable<Content | Partial<Content>> {
    this.uploading = true;
    return this.cs.upload(file, Type.File, this.category)
      .pipe(
        tap(event => {
          if (!("path" in event)) {
            if (event.type == HttpEventType.UploadProgress) {
              this.progress = Math.round(event.loaded / event.total * 100);
            }
          }
        }),
        map(event => {
          if (("path" in event)) {
            this.value = event.id;
            this.onChange(this.value);
            return event;
          }
          return { name: 'uploading...' };
        }),
        finalize(() => {
          this.uploading = false
          this.onTouched();
        }));
  }

  remove(): void {
    this.onTouched();
    this.value = null;
    this.contentSub.next(this.value);
    this.onChange(this.value);
  }

  open(path: string | ArrayBuffer): void {
    window.open(String(path), '_blank', 'noreferrer');
  }
}
