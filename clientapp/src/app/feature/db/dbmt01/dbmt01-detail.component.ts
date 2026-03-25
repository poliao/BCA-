import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { DbLanguage } from './dbmt01.model';
import { Dbmt01Service } from './dbmt01.service';

@Component({
    selector: 'app-dbmt01-detail',
    templateUrl: './dbmt01-detail.component.html'
})
export class Dbmt01DetailComponent extends SubscriptionDisposer implements OnInit {
    language: DbLanguage = {} as DbLanguage;
    languageDataSource!: FormDatasource<DbLanguage>;
    saving = false;
    actions: any;

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
        });
    }

    createLanguageForm() {
        return this.fb.group({
            id: [null],
            languageCode: [null, [Validators.required, Validators.maxLength(10)]],
            languageName: [null, [Validators.required, Validators.maxLength(100)]],
            isActive: [true]
        });
    }

    rebuildForm() {
        this.languageDataSource = new FormDatasource<DbLanguage>(this.language, this.createLanguageForm());
    }

    save() {
        if (this.languageDataSource.form.invalid) {
            this.util.markFormGroupTouched(this.languageDataSource.form);
            return;
        }
        this.languageDataSource.updateValue();
        this.saving = true;
        this.db.save(this.language).subscribe({
            next: (res) => {
                this.language = res;
                this.rebuildForm();
                this.ms.success('message.STD00006');
                this.saving = false;
            },
            error: () => {
                this.saving = false;
            }
        });
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (this.languageDataSource.form.dirty) {
            return this.modal.confirm("message.STD00002");
        }
        return true;
    }
}
