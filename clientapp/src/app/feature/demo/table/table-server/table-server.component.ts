import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria, PageRequest } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-table-server',
  templateUrl: './table-server.component.html'
})
export class TableServerComponent {

  displayedColumns: string[] = ['created', 'state', 'number', 'title'];
  initialPageSort = new PageCriteria('created desc');
  data!: PaginatedDataSource<any, any>;

  constructor(private readonly save: SaveDataService, private readonly _httpClient: HttpClient) { }

  ngOnInit(): void {
    this.initialPageSort = this.save.retrive("table01") ?? this.initialPageSort;

    this.data = new PaginatedDataSource<any, any>(
      (request) => this.getRepoIssues(request),
      this.initialPageSort
    )

    this.data.queryBy({});
  }

  ngOnDestroy(): void {
    this.save.save(this.data.getPageInfo(), "table01");
  }

  getRepoIssues(request: PageRequest<any>): Observable<any> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${request.sort?.split(" ")[0]}&order=${request.sort?.split(" ")[1]}&page=${request.page + 1}`;

    return this._httpClient.disableApiPrefix().disableHeader().get<any>(requestUrl).pipe(
      map(result => ({ rows: result.items, count: result.total_count }))
    )
  }
}