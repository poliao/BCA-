import {Component, OnInit} from '@angular/core';
import {FormDatasource} from '@app/shared/service/base.service';
import {FormUtilService} from '@app/shared/service/form-util.service';
import {DbCountry} from './dbmt07.model';
import {FormBuilder, Validators} from '@angular/forms';
import {Dbmt07Service} from './dbmt07.service';
import {MessageService} from '@app/core/services/message.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from "rxjs";

@Component({
    templateUrl: './dbmt07-detail.component.html',
})
export class Dbmt07DetailComponent implements OnInit {
    country: DbCountry = {} as DbCountry;
    saving = false;
    countryDataSource!: FormDatasource<DbCountry>;
    master: any;
    actions: any;

    constructor(
        private readonly fb: FormBuilder,
        public util: FormUtilService,
        private readonly db: Dbmt07Service,
        private readonly ms: MessageService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.country = data.dbmt07.detail;
            this.master = data.dbmt07.master;
            this.actions = data.dbmt07.actions;
            this.rebuildForm();
        });
    }

    save() {
        let invalid = false;

        this.util.markFormGroupTouched(this.countryDataSource.form);
        if (this.countryDataSource.form.invalid) invalid = true;

        if (invalid) return;

        this.countryDataSource.updateValue();

        const formData = {
            ...this.countryDataSource.model
        };

        this.saving = true;
        this.db.save(formData).pipe(
            switchMap(() => this.db.getCountry(this.countryDataSource.form.controls.countryCode.value))
        ).subscribe(response => {
            this.country = response;
            this.rebuildForm();
            this.ms.success('message.STD00006');
        });
    }

    createCountryForm() {
        return this.fb.group({
            countryCode: [null, [Validators.required]],
            countryNameTha: [null, [Validators.required]],
            countryNameEng: [null],
            active: [true],
        });
    }

    rebuildForm() {
        this.countryDataSource = new FormDatasource<DbCountry>(this.country, this.createCountryForm());
    }
}
