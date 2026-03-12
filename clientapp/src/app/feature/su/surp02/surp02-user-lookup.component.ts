import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { Surp02Service } from './surp02.service';

@Component({
    selector: 'app-surp02-user-lookup',
    template: `
<app-modal header="ชื่อผู้ใช้" (onClose)="close()">
  <app-card>
    <div class="card-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-6">
            <app-search [value]="data.keyword" placeholder="{{ 'label.SURP02.LookUpSearchPlaceholder' | translate }}"
              (search)="onSearch($event)">
            </app-search>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <app-table server [dataSource]="items" [columns]="displayedColumns">
              <ng-container matSort>
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef columnWidth="100px"></th>
                  <td mat-cell *matCellDef="let row">
                    <button class="btn btn-primary btn-sm" (click)="select(row)">
                      {{ 'label.ALL.Select' | translate}}
                    </button>
                  </td>
                </ng-container>
                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header columnWidth="150px">{{ 'label.SURP02.UserName' | translate}}</th>
                  <td mat-cell *matCellDef="let row">
                    {{ row.value }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="text">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header columnWidth="250px">{{ 'label.SURP02.EmployeeName' | translate}}</th>
                  <td mat-cell *matCellDef="let row">
                    {{ row.text }}
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              </ng-container>
            </app-table>
          </div>
        </div>
      </div>
    </div>
  </app-card>
</app-modal>
  `
})
export class Surp02UserLookupComponent implements OnInit {
  displayedColumns: string[] = ['action', 'value', 'text'];
  initialPageSort = new PageCriteria('value,text');
  items!: PaginatedDataSource<any, any>;

  constructor(
    private surp02Service: Surp02Service,
    public dialogRef: MatDialogRef<Surp02UserLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { keyword: string }) { }

  ngOnInit(): void {
    this.items = new PaginatedDataSource<any, any>(
      (request, query) => this.surp02Service.getPageUserLookUp(request, query),
      this.initialPageSort)
    this.items.queryBy({ keyword: this.data.keyword });
  }

    onSearch(value: string): void {
        this.items.queryBy({ keyword: value });
    }

    select(row: any): void {
        this.dialogRef.close(row);
    }

    close(): void {
        this.dialogRef.close(false);
    }
} 