import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomSelectionModal } from '@app/shared/components/datatable/custom-selection-model';
import Big from 'big.js';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-datatable',
  templateUrl: './table.component.html'
})
export class TableComponent {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

  displayedSelectColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol', 'action'];
  dataSourceSelection = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new CustomSelectionModal<any>(true, []);

  remove(_: any): void {
    // implement
  }

  summary(): string {
    return this.dataSource.data.map(row => row.weight)
      .reduce((sum, number) => {
        return new Big(number || 0).add(sum).toFixed(2)
      }, 0);
  }

  show(): void {
    console.log(this.selection.selected);
  }
}