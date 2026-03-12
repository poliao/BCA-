import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { Surt04Service } from './surt04.service';

@Component({
  selector: 'app-surt04',
  templateUrl: './surt04.component.html'
})
export class Surt04Component implements OnInit {
  master = { configGroups: [] };
  displayedColumns: string[] = ['configGroupCode', 'configCode', 'configValue', 'remark'];
  searchForm!: FormGroup;
  initialPageSort = new PageCriteria('configGroupCode,configCode');
  data!: PaginatedDataSource<any, any>;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private su: Surt04Service,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.master = data.surt04;
    });
    this.createSearchForm();
    this.initialPageSort = this.save.retrive('surt04page') ?? this.initialPageSort;
    const values = this.save.retrive('surt04');
    if (values) {
      this.searchForm.patchValue(values);
    }
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getConfigurations(request, query),
      this.initialPageSort)

    this.data.queryBy(this.searchForm.value);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      configGroupCode: null,
      keyword: null
    })
  }

  ngOnDestroy() {
    this.save.save(this.searchForm.value, 'surt04');
    this.save.save(this.data.getPageInfo(), 'surt04page');
  }

  search() {
    this.data.queryBy(this.searchForm.value, true);
  }

  reset() {
    this.searchForm.reset();
  }

}
