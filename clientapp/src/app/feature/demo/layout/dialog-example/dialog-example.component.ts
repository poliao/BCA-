import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html'
})
export class DialogExampleComponent {
  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>) { }

  accept(): void {
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
