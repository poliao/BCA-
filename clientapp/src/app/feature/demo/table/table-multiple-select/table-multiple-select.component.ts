import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { MultipleSelectComponent } from './multiple-select/multiple-select.component';



@Component({
  selector: 'app-table-multiple-select',
  templateUrl: './table-multiple-select.component.html'
})
export class TableMultipleSelectComponent {

  displayedColumns: string[] = ['value', 'text', 'action'];
  data: any = []
  dataSource = new MatTableDataSource<any>(this.data);

  constructor(private modal: ModalService) { }

  remove(row: any) {
    this.data = this.data.filter((o: { value: any; }) => o.value !== row.value);
    this.dataSource.data = this.data;
  }

  add = () => this.modal.open(MultipleSelectComponent, {}, Size.Large).subscribe((result) => {
    if (result) {
      this.data = this.data.concat(result.filter((item: { value: any; }) =>
        !this.data.some((d: { value: any; }) => d.value === item.value)));
      this.dataSource.data = this.data;
    }
  });

}