import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { I18nService } from '@app/core/services/i18n.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {

  constructor(private readonly trans: TranslateService, private readonly i18n: I18nService) {
    super();
    this.setLabel();
    this.i18n.onLangChanged.subscribe(() => this.setLabel());
  }

  private setLabel() {
    this.itemsPerPageLabel = this.trans.instant('label.ALL.ItemPerPage');
    this.firstPageLabel = this.trans.instant('label.ALL.FirstPage');
    this.lastPageLabel = this.trans.instant('label.ALL.LastPage');
    this.nextPageLabel = this.trans.instant('label.ALL.NextPage');
    this.previousPageLabel = this.trans.instant('label.ALL.PreviousPage');
  }
}