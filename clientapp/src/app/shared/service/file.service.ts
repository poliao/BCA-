import { Injectable } from '@angular/core';

import * as Buffer from 'buffer';
import { ImageFile } from '../components/attachment/image/image-file.model';
import { Attachment } from '../components/attachment/attachment.model';
@Injectable({
    providedIn: 'root'
})
export class FileService {
    getContent(file): Promise<any> {
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (event: any) => {
                let buffer = event.target.result;
                const byte = Buffer.Buffer.from(buffer);
                resolve(byte);
            }
            fileReader.readAsArrayBuffer(file)
        })
    }

    getUrl(file): Promise<any> {
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (event: any) => {
                let url = event.target.result;
                resolve(url);
            }
            fileReader.readAsDataURL(file)
        })
    }

    invalidSize(size: number, maxSize: number): any {
        let mb = size / (1024 * 1000);
        mb = Math.round(mb * 100) / 100;
        const result = mb > maxSize;
        return { invalid: result, size: mb }
    }
    invalidExt(fileName: string, types: string) {
        types = types.toUpperCase();
        const ext = fileName.toUpperCase().split('.').pop() || fileName;
        return !types.includes(ext);
    }
    download(response) {
        let name = this.getFileNameFromResponseContentDisposition(response);
        var downloadUrl = URL.createObjectURL(response.body);
        var anchor = document.createElement("a");
        anchor.download = name;
        anchor.href = downloadUrl;
        anchor.click();
    }

    private getFileNameFromResponseContentDisposition(response) {
        const contentDisposition = response.headers.get('content-disposition') || '';
        const matches = /filename=([^;]+)/ig.exec(contentDisposition);
        const fileName = (matches[1] || 'untitled').replace(/"/g, '').trim();
        return fileName;
    };

    public convertModelToFormData(object = {}, fileObject = {}) {

        const formData = new FormData();

        if (!object || !(object instanceof Object)) {
            return formData;
        }

        for (const key of Object.keys(fileObject)) {
            const value = fileObject[key];
            if (value && typeof value.File !== 'undefined' && typeof value.Name !== 'undefined') {
                formData.append(key, value.File, value.Name);
            }
            else if (value instanceof Array) {
                for (const item of value) {
                    if (item && typeof item.File !== 'undefined' && typeof item.Name !== 'undefined') {
                        formData.append(key, item.File, item.Name);
                    }
                }
            }
        }
        formData.append("json", JSON.stringify(object))
        return formData;
    }
}
