import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appDragDrop]'
})
export class DragDropDirective {
    @Input() disableDrag: boolean = false;
    @Output() onFileDropped = new EventEmitter<FileList>();

    @HostBinding('style.background-color') private background = '#f5fcff'
    @HostBinding('style.opacity') private opacity = '1'

    //Dragover listener
    @HostListener('dragover', ['$event'])
    public onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        if (!this.disableDrag) {
            evt.preventDefault();
            evt.stopPropagation();
            this.background = '#9ecbec';
            this.opacity = '0.8'
        }
    }
    //Dragleave listener
    @HostListener('dragleave', ['$event'])
    public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        if (!this.disableDrag) {
            evt.preventDefault();
            evt.stopPropagation();
            this.background = '#f5fcff'
            this.opacity = '1'
        }
    }
    //Drop listener
    @HostListener('drop', ['$event'])
    public ondrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: FileList; }; }) {
        if (!this.disableDrag) {
            evt.preventDefault();
            evt.stopPropagation();
            this.background = '#f5fcff'
            this.opacity = '1'
            const files = evt.dataTransfer.files;
            if (files.length > 0) {
                this.onFileDropped.emit(files)
            }
        }
    }

}