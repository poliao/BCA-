import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { BehaviorSubject, concat, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { BaseFormField } from '../../base-form';
import { Category } from '../category';
import { Content, ContentUploadService, Type } from '../content-upload.service';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent extends BaseFormField {
  @Input() category!: Category;
  @Input() max = 3072;
  @Input() width?: number | string = 'auto';

  contentSub!: BehaviorSubject<number | { file: File, upload: boolean }>;
  content!: Observable<Content | Partial<Content>>;
  contentView!: Observable<Content | Partial<Content>>;
  uploading = false;
  progress?: number;
  errorMessages: { message: string, param?: { [key: string]: Object } }[] = [];

  constructor(
    public cs: ContentUploadService
  ) {
    super();
    this.contentSub = new BehaviorSubject<number | { file: File, upload: boolean }>(null);
    this.content = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "number")
          return concat(of({ path: 'assets/images/loading.svg', loading: true }), this.cs.getContent(source));
        if (typeof (source) == "object" && source?.upload)
          return this.upload(source.file);
        if (typeof (source) == "object" && source)
          return this.readFileAsync(source);
        return of({});
      }));
    this.contentView = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "number")
          return concat(of({ path: 'assets/images/loading.svg', loading: true }), this.cs.getContent(source));
        if (typeof (source) == "object" && source)
          return this.readFileAsync(source);
        return of({});
      }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.contentSub.next(Number(this.value));
    }
  }

  override writeValue(id?: number): void {
    this.value = id;
    this.contentSub.next(this.value);
  }

  validate(file: File): boolean {
    this.errorMessages = [];
    let invalid = false;
    if (file['type'].split('/')[0] != 'image') {
      this.errorMessages.push({ message: 'message.STD00030' });
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

  add(event: any): void {
    let file = null;
    if (event instanceof FileList) {
      if (event.length === 0) { return; }
      file = event[0];
    } else {
      if (event.target.files.length === 0) { return; }
      file = event.target.files[0];
    }

    if (this.validate(file)) {
      event.target.value = null;
      return;
    }

    this.contentSub.next(file);
    this.contentSub.next({ file: file, upload: true });
    if ("target" in event) event.target.value = null;
  }

  upload(file: File): Observable<Content | HttpEvent<Content>> {
    this.uploading = true;
    return this.cs.upload(file, Type.Image, this.category)
      .pipe(
        tap(event => {
          if (!("path" in event)) {
            if (event.type == HttpEventType.UploadProgress) {
              this.progress = Math.round(event.loaded / event.total * 100);
            }
          }
        }),
        map(event => {
          if ("path" in event) {
            this.value = event.id;
            this.onChange(this.value);
            return event;
          }
          return {} as Content | HttpEvent<Content>;
        }),
        finalize(() => {
          this.uploading = false
          this.onTouched();
        }));
  }

  remove(): void {
    this.value = null;
    this.contentSub.next(null);
    this.onChange(this.value);
  }

  private readFileAsync(file: File): Observable<Partial<Content>> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const observable = new Observable<Partial<Content>>(subscriber => {
      reader.onload = (e: any) => {
        const content = { id: null, path: e.target.result } as Partial<Content>
        subscriber.next(content);
        subscriber.complete();
      };
      reader.onerror = (error): void => {
        subscriber.error(error);
      }
    });
    return observable;
  }
}
