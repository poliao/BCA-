import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-qtmt01-rd-lookup',
    template: `
<app-modal header="รายชื่อผู้เสียภาษี (กรมสรรพากร)" (onClose)="close()">
  <app-card>
    <div class="card-content px-0">
        <div class="row px-3 mb-2">
            <div class="col-12">
                <p class="text-muted">พบข้อมูลจากกรมสรรพากรดังนี้ กรุณาเลือกรายการที่ต้องการ:</p>
            </div>
        </div>
        <app-table [dataSource]="items" [columns]="displayedColumns" [pagination]="false">
            <ng-container matColumnDef="action">
                <th mat-header-cell *matHeaderCellDef columnWidth="80px"></th>
                <td mat-cell *matCellDef="let row" class="text-center">
                    <button class="btn btn-primary btn-sm" (click)="select(row)">
                        {{ 'label.ALL.Select' | translate}}
                    </button>
                </td>
            </ng-container>
  
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>ชื่อผู้เสียภาษี</th>
                <td mat-cell *matCellDef="let row">
                    {{ row.name ? row.name.trim() : '-' }}
                </td>
            </ng-container>
       
            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>ที่อยู่</th>
                <td mat-cell *matCellDef="let row" class="small">
                    {{ row.addressLocal || row.addressDescription }}
                </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </app-table>
    </div>
  </app-card>
</app-modal>
    `
})
export class Qtmt01RdLookupComponent implements OnInit {
    displayedColumns: string[] = ['action', 'name', 'address'];
    items: MatTableDataSource<any> = new MatTableDataSource<any>();

    constructor(
        public dialogRef: MatDialogRef<Qtmt01RdLookupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { items: any[] }
    ) { }

    ngOnInit(): void {
        this.items.data = this.data.items || [];
    }

    select(row: any): void {
        this.dialogRef.close(row);
    }

    close(): void {
        this.dialogRef.close(false);
    }
}
