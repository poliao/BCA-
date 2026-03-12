import { Component, HostListener, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { FileService } from '@app/shared/service/file.service';
import { ImageFile } from './image-file.model';

@Component({
    selector: 'image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ImageUploadComponent, multi: true }
    ]
})
export class ImageUploadComponent implements ControlValueAccessor {
    isOver: boolean = false;
    file: ImageFile;
    isDisable: boolean = false;
    errors: string[] = [];
    status: boolean;
    @Input() outputByte = true;
    @Input() placeholder: string;
    @Output() remove = new EventEmitter<string>();
    @Output() fileUpdated = new EventEmitter<ImageFile | null>()
    onChange = (value: string | null) => { };
    onTouched = () => { };

    constructor(private fs: FileService,
    ) { }

    writeValue(value: string | ImageFile): void {
        if (typeof value === 'string') {
            this.file = { File: null, Name: 'Uploaded Image', DataUrl: value, Uploaded: true, Status: true } as ImageFile;
        } else {
            this.file = value;
        }
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }

    @HostListener('dragstart', ['$event']) onDrag(event) {
        event.preventDefault();
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.isOver = true && !this.isDisable;
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.isOver = false;
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.isOver = false;
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) async onDrop(event) {
        this.isOver = false;
        event.preventDefault();
        event.stopPropagation();
        if (!this.isDisable) {
            await this.addFile(event.dataTransfer.files);
            this.onChange(this.file?.DataUrl || null);
        }
    }
    onClick(input: HTMLElement) {
        if (!this.isDisable) {
            input.click();
        }
    }
    async onFileChange(event) {
        await this.addFile(event.target.files);
        this.onChange(this.file?.Name || null);

    }
    
    onRemove(fileInput) {
        this.onTouched();
        if (this.file) {
            this.remove.emit(this.file.Name);
        }
        
        fileInput.value = null;
        this.file = null;
        this.onChange(null);

    }

    onUpdateFile(newFile: ImageFile | null) {
        this.fileUpdated.emit(newFile);
      }

    private async addFile(files: File[]) {
        this.errors = [];
        let file = files[0];
        if (file != undefined) {
            const result = this.fs.invalidSize(file.size, 4);
            if (result.invalid) {

                this.status = false;
            } else {
                this.status = true;
            }

            if (!(file.type.includes("image"))) {
                this.errors.push(`Error (Extension): ${file.name}`);
                return false;
            }

            let dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);

            this.file = {File: file, Name: file.name, DataUrl: dataUrl, Uploaded: false, Status: this.status } as ImageFile;
            this.onTouched();
            this.onUpdateFile(this.file)
        }
        return true
    }
}