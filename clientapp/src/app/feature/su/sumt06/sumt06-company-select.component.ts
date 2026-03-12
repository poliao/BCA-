import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomSelectionModal } from '@app/shared/components/datatable/custom-selection-model';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { Sumt06Service } from './sumt06.service';

@Component({
  selector: 'app-multiple-select',
  template: `
   <app-modal header="{{ 'label.SUMT06.CompanyName' | translate }}" (onClose)="close()">
    <app-card>
        <div class="card-content">
        <div class="row" style="display: flex; align-items: center;">
                    <div class="col-12">
                            <app-search [value]="keyword" (search)="onSearch($event)"
                            placeholder="{{ 'รหัสบริษัท, ชื่อบริษัท' | translate }}">
                        </app-search>
                    </div>
          </div>           
            <div class="row">
                <div class="col">
                    <app-table server [dataSource]="dataSource" [columns]="displayedSelectColumns">
                        <ng-container matSort>
                            <ng-container matColumnDef="select">
                                <th mat-header-cell *matHeaderCellDef class="text-center">
                                    <checkbox [hasLabel]="false"
                                        [indeterminate]="selection.hasValue() && !selection.isAllSelected(dataSource.data)"
                                        [value]="selection.hasValue() && selection.isAllSelected(dataSource.data)"
                                        (afterChange)="selection.masterToggle(dataSource.data)"></checkbox>
                                </th>
                                <td mat-cell *matCellDef="let row" class="text-center">
                                    <checkbox [disabled]="row.disabled" [hasLabel]="false"
                                        [value]="selection.isSelected(row)" (afterChange)="selection.toggle(row)">
                                    </checkbox>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="value">
                                <th mat-header-cell *matHeaderCellDef mat-sort-header columnWidth="120px" class="text-center">{{ 'label.SUMT06.CompanyCode' | translate }}
                                </th>
                                <td mat-cell *matCellDef="let element"> {{element.value}} </td>
                            </ng-container>
                            <ng-container matColumnDef="text">
                                <th mat-header-cell *matHeaderCellDef mat-sort-header columnWidth="300px" class="text-center">{{ 'label.SUMT06.CompanyName' | translate }}
                                </th>
                                <td mat-cell *matCellDef="let element"> {{element.text}} </td>
                            </ng-container>
                            <tr mat-header-row *matHeaderRowDef="displayedSelectColumns"></tr>
                        </ng-container>
                    </app-table>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="text-center">
                        <button class="btn btn-primary" (click)="select()">
                            {{ 'label.ALL.Select' | translate }}</button>
                    </div>
                </div>
            </div>
        </div>
    </app-card>
</app-modal>
  `
})
export class Sumt06CompanySelectComponet implements OnInit {
  displayedSelectColumns: string[] = ['select', 'value', 'text'];

  initialPageSort = new PageCriteria('value,text');
  dataSource!: PaginatedDataSource<any, any>;
  compareFunc = (data, select) => data.value === select.value
  selection = new CustomSelectionModal<any>(true, [], null, this.compareFunc);
  keyword = '';
  constructor(
    private readonly dialog: MatDialogRef<Sumt06CompanySelectComponet>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private su: Sumt06Service
  ) { }

  ngOnInit(): void {
    this.dataSource = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getCompanyLookupPage(request, query),
      this.initialPageSort)

    this.dataSource.queryBy({});
  }


  onSearch(value: string) {
    this.keyword = value;
    this.dataSource.queryBy({ keyword: this.keyword }, true);
  }

  isDisableHeader(rows: any[]): boolean {
    return rows.some(r => r.disabled);
  }

  select(): void {
    this.dialog.close(this.selection.selected)
  }

  close(): void {
    this.dialog.close(false);
  }
}