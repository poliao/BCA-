import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Content } from "@app/shared/components/attachment/content-upload.service";

@Component({
    selector: 'app-multiple-file-modal',
    templateUrl: './multiple-file-modal.component.html'
})
export class MultipleFileModalComponent {
    accept: string = '.txt,.png,.pdf'

    constructor(public dialogRef: MatDialogRef<MultipleFileModalComponent>) { }

    getOutputFiles(files: Content[]): void {
        if (files || files.length !== 0) this.dialogRef.close(files);
    }

    close(): void {
        this.dialogRef.close([]);
    }
}