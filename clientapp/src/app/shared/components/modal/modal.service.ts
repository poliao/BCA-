import { Injectable, Injector, TemplateRef } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable, switchMap } from "rxjs";
import { ConfirmComponent } from "./confirm/confirm.component";
import { ModalResolve } from "./modal-resolver";
import { ShowImgComponent } from "./showImg/showImg.component";

export enum Size {
  Small = "300px",
  Medium = "500px",
  Large = "800px",
  ExtraLarge = "1140px",
  FullScreen = "990vw"
}

@Injectable()
export class ModalService {

  constructor(private readonly injector: Injector, private readonly dialog: MatDialog) { }

  private openingComponent(content) {
    const opening: MatDialogRef<any, any> = this.dialog.openDialogs.find(o => o.componentInstance.constructor.name === content.name);
    if (opening) return opening;
    return null;
  }

  showImgModal(imgData: any): void {
    this.dialog.open(ShowImgComponent, {
      data: imgData,
      width: '40vw', // กำหนดความกว้างของ modal ตามที่ต้องการ
      height: '40vh', // กำหนดความสูงของ modal ตามที่ต้องการ
      autoFocus: false // ปิดใช้งาน Auto focus เพื่อป้องกันการเลื่อนหน้าต่างเมื่อเปิด modal
    });
  }

  confirm(message: string, initialState?: { renderHtml: boolean }, size: Size = Size.Medium) {
    const dialogRef = this.dialog.open(ConfirmComponent, { data: { message, initialState }, width: size, position: { top: '20vh' } });
    return dialogRef.afterClosed();
  }

  openTemplate(content: TemplateRef<any>, initialState?: Object, size: Size = Size.Medium): MatDialogRef<any> {
    const dialogRef = this.dialog.open(content, { data: initialState, width: size });
    return dialogRef;
  }

  open(content, initialState?: Object, size: Size = Size.Medium, resolver?: any, resolverParam?: any): Observable<any> {
    const opening = this.openingComponent(content);
    if (opening) return opening.afterClosed();
    if (resolver) {
      const instant = this.injector.get<ModalResolve<any>>(resolver);
      return instant.resolve(resolverParam).pipe(
        switchMap(result => {
          Object.assign(initialState, { resolved: result })
          const dialogRef = this.dialog.open(content, { data: initialState, width: size });
          return dialogRef.afterClosed()
        })
      )
    }
    else {
      const dialogRef = this.dialog.open(content, { data: initialState, width: size });
      return dialogRef.afterClosed()
    }
  }
}