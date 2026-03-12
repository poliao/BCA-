import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageFile } from './image-file.model';
import { FileService } from '@app/shared/service/file.service';


export interface SecuritiesImage {
  ImageId: number;
  RegisterId: number;
  ImageName: string;
  AttahmentId: number;
}

export interface Attachment {
  AttahmentName: string;
  Image: ImageFile;
}

export interface AttachmentIdentity {
  AttahmentName: string;
  Image: ImageFile;
  CategoryType: string;
  CustomerCode: string;
  FileName: string;
}

@Injectable({
    providedIn: 'root'
})
export class ImageDisplayService {
  defaultImage = "assets/img/photo.svg";
  Attahment: Attachment = {} as Attachment;
  AttahmentIdentity: AttachmentIdentity = {} as AttachmentIdentity;
  constructor(private http: HttpClient, private fs: FileService) { }

  //resize image & optimize before serve with .net IIS imagereizer module.
  public display(url, thumbnail = false, width = null, height = null, other = null) {
    if (!url) return this.defaultImage;
    return this.encode(url);
  }

  public displayIcon(url, width = null, height = null) {
    if (!url) return this.defaultImage;
    return this.encode(url);
  }

  public encode(url) {
    return encodeURI(url || '').replace(/[#!'*()]/g, match => '%' + match.charCodeAt(0).toString(16));
  }

  getReferenceSecureImage(ReferenceSecure) {
    return this.http.get<SecuritiesImage[]>('loan/requestSecurities/getReferenceSecureImage', { params: { ReferenceSecure: ReferenceSecure } });
  }

  uploadImgAuto(imgUpload: ImageFile) {
    this.Attahment.AttahmentName = imgUpload.Name;
    let formData = this.fs.convertModelToFormData(this.Attahment, { Image: imgUpload });
    return this.http.post<number>('loan/requestSecurities/saveImgAutoUploadSecurities', formData).toPromise();
  }

  removeUploadImgAuto(imgUpload: ImageFile, fileName: string) {
    this.Attahment.AttahmentName = fileName;
    let formData = this.fs.convertModelToFormData(this.Attahment, { Image: imgUpload });
    return this.http.post<number>('loan/requestSecurities/removeImgAutoUpload', formData).toPromise();
  }

  uploadImgIdentityAuto(imgUpload: ImageFile, categoryType: string, customerCode: string) {
    this.AttahmentIdentity.AttahmentName = imgUpload.Name;
    this.AttahmentIdentity.CategoryType = categoryType;
    this.AttahmentIdentity.CustomerCode = customerCode;
    let formData = this.fs.convertModelToFormData(this.AttahmentIdentity, { Image: imgUpload });
    return this.http.post<number>('loan/uploadfileauto/saveImgAutoUploadIdentity', formData).toPromise();
  }

  removeImgIdentityAuto(imgUpload: ImageFile, categoryType: string, customerCode: string, fileName: string) {
    this.AttahmentIdentity.AttahmentName = imgUpload.Name;
    this.AttahmentIdentity.CategoryType = categoryType;
    this.AttahmentIdentity.CustomerCode = customerCode;
    this.AttahmentIdentity.FileName = fileName;
    let formData = this.fs.convertModelToFormData(this.AttahmentIdentity, { Image: imgUpload });
    return this.http.post<number>('loan/uploadfileauto/removeImgAutoUploadIdentity', formData).toPromise();
  }
}

