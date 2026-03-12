import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomSelectionModal } from '@app/shared/components/datatable/custom-selection-model';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { Sumt04Service } from '../sumt04.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SuProfileMenu } from '../sumt04.model';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sumt04-menu',
  templateUrl: './sumt04-menu.component.html'
})
export class Sumt04MenuComponent implements OnInit {
  master: any;
  displayedSelectColumns: string[] = ['select', 'systemCode', 'menuCode', 'menuName'];
  searchForm!: FormGroup;
  initialPageSort = new PageCriteria('systemCode,menuCode');
  dataSource!: PaginatedDataSource<any, any>;
  compareFunc = (data: { menuCode: string, systemCode: string; }, 
                select: { menuCode: string, systemCode: string; }) => data.menuCode === select.menuCode && data.systemCode === select.systemCode;
  selection = new CustomSelectionModal<any>(true, [], null, this.compareFunc);
  existingMenus: SuProfileMenu[] = [];
  existingMenuCodes: string[] = [];

  constructor(
    private ss: Sumt04Service, 
    private dialog: MatDialogRef<Sumt04MenuComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.master = this.data;
    this.existingMenus = this.data.data.existingMenus || [];
    console.log(this.data);
    
    this.existingMenuCodes = this.existingMenus.map(menu => `${menu.systemCode}_${menu.menuCode}`);
    
    this.dataSource = new PaginatedDataSource<any, any>(
      (request, query) => this.ss.getMenus(request, query).pipe(
        tap(response => {
          if (response && response.rows) {
            for (const row of response.rows) {
              const menuKey = `${row.systemCode}_${row.menuCode}`;
              if (this.existingMenuCodes.includes(menuKey)) {
                row.disabled = true;
                
                setTimeout(() => {
                  this.selection.select(row);
                });
              }
            }
          }
        })
      ),
      this.initialPageSort
    );
    
    this.dataSource.queryBy({});
    
    this.searchForm = this.fb.group({
      systemCode: null,
      menuCode: null,
      menuName: null
    });
  }

  isAllSelected(data: any[]): boolean {
    if (!data || data.length === 0) return false;
    
    const selectableItems = data.filter(item => !item.disabled);
    if (selectableItems.length === 0) return false;
    
    for (const item of selectableItems) {
      if (!this.selection.isSelected(item)) {
        return false;
      }
    }
    
    return true;
  }

  masterToggle(data: any[]): void {
    if (!data || data.length === 0) return;
    
    const selectableItems = data.filter(item => !item.disabled);
    if (selectableItems.length === 0) return;
    
    if (this.isAllSelected(data)) {
      selectableItems.forEach(item => this.selection.deselect(item));
    } else {
      selectableItems.forEach(item => this.selection.select(item));
    }
  }

  onSearch() {
    this.dataSource.queryBy(this.searchForm.value, true);
  }

  select() {
    const newlySelected = this.selection.selected.filter(item => !item.disabled);
    this.dialog.close(newlySelected);
  }

  close() {
    this.dialog.close(false);
  }
}
