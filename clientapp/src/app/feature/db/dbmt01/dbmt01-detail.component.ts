import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { DbLanguage, DbLocalization } from './dbmt01.model';
import { Dbmt01Service } from './dbmt01.service';
import { forkJoin, map } from 'rxjs';
import { RowState } from '@app/shared/constants';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { PageCriteria } from '@app/shared/components/datatable/page';

@Component({
    selector: 'app-dbmt01-detail',
    templateUrl: './dbmt01-detail.component.html'
})
export class Dbmt01DetailComponent extends SubscriptionDisposer implements OnInit {
    language: DbLanguage = {} as DbLanguage;
    languageDataSource!: FormDatasource<DbLanguage>;
    localizations!: PaginatedDataSource<FormDatasource<DbLocalization>, any>;
    localizationDataSources: FormDatasource<DbLocalization>[] = []; // We use this to track current and locally added/deleted items
    saving = false;
    actions: any;
    displayedColumns: string[] = ['moduleName', 'key', 'value', 'action'];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
        public util: FormUtilService,
        private modal: ModalService,
        private readonly ms: MessageService,
        private readonly db: Dbmt01Service
    ) {
        super();
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.language = data.dbmt01.detail;
            this.actions = data.dbmt01.actions;
            this.rebuildForm();
            if (this.language.languageCode) {
                this.loadLocalizations();
            }
        });
    }

    loadLocalizations() {
        this.localizations = new PaginatedDataSource<FormDatasource<DbLocalization>, any>(
            (request, query) => this.db.getLocalizations(this.language.languageCode, request).pipe(
                map(res => {
                    const localAdds = this.localizationDataSources.filter(l => l.isAdd);
                    const rows = res.rows.map(item => {
                        const tracked = this.localizationDataSources.find(l => l.model.id === item.id);
                        if (tracked) return tracked;
                        const source = new FormDatasource<DbLocalization>(item, this.createLocalizationForm());
                        source.markToNormal();
                        return source;
                    });

                    let combinedRows = rows;
                    if (request.page === 0) {
                        combinedRows = [...localAdds, ...rows];
                    }

                    return {
                        rows: combinedRows,
                        count: res.count + localAdds.length
                    };
                })
            ),
            new PageCriteria('key')
        );
        this.localizations.queryBy({});
    }

    reload() {
        // With PaginatedDataSource, the table reloads automatically
    }

    createLanguageForm() {
        return this.fb.group({
            id: [null],
            languageCode: [null, [Validators.required, Validators.maxLength(10)]],
            languageName: [null, [Validators.required, Validators.maxLength(100)]],
            isActive: [true],
            rowVersion: [null]
        });
    }

    createLocalizationForm() {
        return this.fb.group({
            id: [null],
            moduleName: [null, [Validators.required, Validators.maxLength(100)]],
            key: [null, [Validators.required, Validators.maxLength(255)]],
            value: [null, [Validators.maxLength(2000)]],
            rowVersion: [null]
        });
    }

    rebuildForm() {
        this.languageDataSource = new FormDatasource<DbLanguage>(this.language, this.createLanguageForm());
        if (this.language.languageCode) {
            this.languageDataSource.form.controls.languageCode.disable({ emitEvent: false });
        }
    }

    addRow() {
        const item = new DbLocalization();
        item.languageCode = this.language.languageCode;
        item.rowState = RowState.Add;
        const dataSource = new FormDatasource<DbLocalization>(item, this.createLocalizationForm());
        this.localizationDataSources.unshift(dataSource);
        this.localizations.queryBy({}); // Trigger reload
    }

    removeRow(source: FormDatasource<DbLocalization>) {
        if (source.isAdd) {
            this.localizationDataSources = this.localizationDataSources.filter(o => o !== source);
        } else {
            source.markForDelete();
            if (!this.localizationDataSources.includes(source)) {
                this.localizationDataSources.push(source);
            }
        }
        this.localizations.queryBy({});
    }

    save() {
        if (this.languageDataSource.form.invalid || this.localizationDataSources.some(l => !l.isDelete && l.form.invalid)) {
            this.util.markFormGroupTouched(this.languageDataSource.form);
            this.localizationDataSources.forEach(l => {
                if (!l.isDelete) this.util.markFormGroupTouched(l.form);
            });
            return;
        }

        this.languageDataSource.updateValue();
        this.localizationDataSources.forEach(l => l.updateValue());
        
        // Also capture any changes from the current page that aren't in localizationDataSources yet
        this.localizations.data.forEach(l => {
            if (l.form.dirty && !this.localizationDataSources.includes(l)) {
                l.updateValue();
                this.localizationDataSources.push(l);
            }
        });

        this.saving = true;
        const langCode = this.language.languageCode;
        const localizationData = this.localizationDataSources
            .filter(l => !l.isNormal || l.isDelete)
            .map(l => l.model);

        forkJoin({
            lang: this.db.save(this.language),
            localizations: this.db.saveLocalizations(langCode, localizationData)
        }).subscribe({
            next: (res) => {
                this.language = res.lang;
                this.rebuildForm();
                this.ms.success('message.STD00006');
                this.loadLocalizations();
                this.saving = false;
            },
            error: () => {
                this.saving = false;
            }
        });
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (this.languageDataSource.form.dirty || this.localizationDataSources.some(l => l.form.dirty || l.isDelete || l.isAdd)) {
            return this.modal.confirm("message.STD00002");
        }
        return true;
    }
}
