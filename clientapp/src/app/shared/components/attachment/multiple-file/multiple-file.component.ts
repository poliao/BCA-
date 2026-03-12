import { HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MessageService } from "@app/core/services/message.service";
import { Observable, finalize, forkJoin, map, tap } from "rxjs";
import { BaseFormField } from "../../base-form";
import { Category } from "../category";
import { Content, ContentUploadService, Type } from "../content-upload.service";

@Component({
    selector: "multiple-file",
    templateUrl: "./multiple-file.component.html",
    styleUrls: ["./multiple-file.component.scss"]
})
export class MultipleFileComponent extends BaseFormField {
    @Input() category!: Category;
    @Input() max = 3072;
    @Input() accept: string = '.txt,.png';
    @Input() height = "auto";
    @Output() outputFiles = new EventEmitter<Content[]>();

    uploading = false;
    progress?: number;
    errorMessages: { message: string, param?: string[] }[] = [];
    description: string = "";

    constructor(public cs: ContentUploadService, private ms: MessageService) {
        super();
    }

    emitEvent(contents: Content[]): void {
        this.outputFiles.emit(contents);
    }

    add(event: FileList | Event): void {
        let fileList: FileList;
        let contents: Content[] = [];
        if (event instanceof FileList) {
            if (event.length === 0) { return; }
            fileList = event;
        } else {
            const input = event.target as HTMLInputElement;
            if (input?.files.length === 0) { return; }
            fileList = input.files;
        }

        const fileObs = this.convertFileListToArray(fileList)
            .map((file: File) => this.upload(file));
            
        if (fileObs.length === 0) { return; }
        forkJoin(fileObs)
            .subscribe({
                next: (val: Content[]) => {
                    contents = contents.concat(val);
                },
                complete: () => {
                    this.emitEvent(contents);
                }
            });
    }

    upload(file: File): Observable<Content | { name: string; }> {
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
                        return event;
                    }
                    return { name: 'uploading...' };
                }),
                finalize(() => {
                    this.uploading = false
                }));
    }

    convertFileListToArray(files: FileList): File[] {
        const fileArray = [] as File[];
        for (const file of Array.from(files)) {
            if (!this.validate(file)) {
                fileArray.push(file);
            }
            this.errorMessages.forEach(error => {
                this.ms.error(error.message, error.param || null);
            });
        }
        return fileArray;
    }

    validate(file: File): boolean {
        this.errorMessages = [];
        let invalid = false;

        const acceptTypes = this.accept.split(",");
        const accpetTypeRegex = acceptTypes.map(type => "\\" + type).join('|')
        const type = file.name;
        let regex = new RegExp(`(${accpetTypeRegex})$`);

        if (acceptTypes.length > 0 && !regex.exec(type)) {
            this.errorMessages.push({ message: 'message.STD00033', param: [this.accept] });
            invalid = true;
        }

        if (file.size === 0) {
            this.errorMessages.push({ message: 'message.STD00031' });
            invalid = true;
        }

        if (Math.round((file.size / 1024)) > this.max) {
            this.errorMessages.push({ message: 'message.STD00032', param: [`${this.max / 1024}`] });
            invalid = true;
        }

        return invalid;
    }

    convertText(): string {
        const acceptTypes = this.accept.split(",");
        const upperText = acceptTypes.map(extension => extension.trim().toUpperCase());
        return upperText.join(', ');
    }
}