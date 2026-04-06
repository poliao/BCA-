import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { DbLanguage, DbLocalization } from './dbmt01.model';
import { Dbmt01Service } from './dbmt01.service';
import { forkJoin } from 'rxjs';
import { RowState } from '@app/shared/constants';

@Component({
    selector: 'app-dbmt01-detail',
    templateUrl: './dbmt01-detail.component.html'
})
export class Dbmt01DetailComponent extends SubscriptionDisposer implements OnInit {
    language: DbLanguage = {} as DbLanguage;
    languageDataSource!: FormDatasource<DbLanguage>;
    localizations = new MatTableDataSource<FormDatasource<DbLocalization>>([]);
    localizationDataSources: FormDatasource<DbLocalization>[] = [];
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
        this.db.getLocalizations(this.language.languageCode).subscribe(data => {
            this.localizationDataSources = data.map(item => {
                const source = new FormDatasource<DbLocalization>(item, this.createLocalizationForm());
                source.markToNormal();
                return source;
            });
            this.reload();
        });
    }

    reload() {
        this.localizations.data = this.localizationDataSources.filter(o => !o.isDelete);
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
        this.reload();
    }

    removeRow(source: FormDatasource<DbLocalization>) {
        if (source.isAdd) {
            this.localizationDataSources = this.localizationDataSources.filter(o => o.id !== source.id);
        } else {
            source.markForDelete();
        }
        this.reload();
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

        this.saving = true;
        const langCode = this.language.languageCode;
        // Send items that are not Normal OR are Delete
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
