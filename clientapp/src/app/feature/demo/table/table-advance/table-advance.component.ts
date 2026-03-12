import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

const Packages: any[] = [
  { startDate: '1', roomType: '10k 10t', dayOfWeek: 'Fri Sat', isGroup: true },
  { startDate: '1', roomType: '10k 10t', dayOfWeek: 'Fri Sat', name: 'R-01:Villa', price: 1000, sellingPrice: 1000, barRate: 10000 },
  { startDate: '1', roomType: '10k 10t', dayOfWeek: 'Fri Sat', name: 'F-B:Breakfast', price: 1000, sellingPrice: 1000, barRate: 10000 },
  { startDate: '1', roomType: '10k 10t', dayOfWeek: 'Fri Sat', total: 1000, isTotal: true },
  { startDate: '2', roomType: '1pk 1pt', dayOfWeek: 'Fri Sat', isGroup: true },
  { startDate: '2', roomType: '1pk 1pt', dayOfWeek: 'Fri Sat', name: 'R-02:Villa', price: 1000, sellingPrice: 1000, barRate: 10000 },
  { startDate: '2', roomType: '1pk 1pt', dayOfWeek: 'Fri Sat', name: 'F-B2:Breakfast', price: 1000, sellingPrice: 1000, barRate: 10000 },
  { startDate: '2', roomType: '1pk 1pt', dayOfWeek: 'Fri Sat', total: 1000, isTotal: true },

]

const AdjustSellingPrices: any[] = [
  { percent: '0', adjustPrice: { single: 0, double: 0 } },
  { percent: '20', adjustPrice: { single: 0, double: 0 } },
  { percent: '25', adjustPrice: { single: 0, double: 0 } },
  { percent: '30', adjustPrice: { single: 0, double: 0 } },
]

@Component({
  selector: 'app-table-advance',
  templateUrl: './table-advance.component.html'
})
export class TableAdvanceComponent implements OnInit {

  displayedAdvanceColumns: string[] = ['name', 'price', 'sellingPrice', 'barRate']
  displayedMatrix: string[] = [];
  allColumns: string[] = []
  adjust = AdjustSellingPrices;

  advanceDataSource = new MatTableDataSource<any>(Packages);

  adjustHeader = [];
  adjustParent = ['parentDummy', 'parent'];

  constructor() { }

  ngOnInit(): void {
    const matrix = [];
    AdjustSellingPrices.forEach(o => {
      matrix.push(`${o.percent}.single`);
      matrix.push(`${o.percent}.double`);
    })
    this.displayedMatrix = matrix;
    this.allColumns = [...this.displayedAdvanceColumns, ...this.displayedMatrix];

    this.adjustHeader = ['percentDummy', ...this.adjust.map(o => o.percent)]
  }

  getName(a: any, word: string) {
    return `${a.percent}.${word}`;
  }

  isGroup(item: { isGroup: boolean; }): boolean {
    return item.isGroup;
  }

  isTotal(item: { isTotal: boolean; }): boolean {
    return item.isTotal;
  }
}