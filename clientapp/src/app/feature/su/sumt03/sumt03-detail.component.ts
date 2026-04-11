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
import { ProductionProcess, ProcessPricingTier } from './sumt03.model';
import { Sumt03Service } from './sumt03.service';
import { RowState } from '@app/shared/constants';

@Component({
  selector: 'app-sumt03-detail',
  templateUrl: './sumt03-detail.component.html'
})
export class Sumt03DetailComponent extends SubscriptionDisposer implements OnInit {
  master = { processGroups: [], productionLocations: [] };
  process: ProductionProcess = new ProductionProcess();

  processDataSource!: FormDatasource<ProductionProcess>;
  pricingTierDataSources: FormDatasource<ProcessPricingTier>[] = [];
  pricingTiersDataSource = new MatTableDataSource<FormDatasource<ProcessPricingTier>>();

  saving = false;
  actions: any;
  displayedColumns: string[] = ['minQty', 'maxQty', 'fixedCost', 'variableRate', 'variableUnitLabel', 'action'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    private ms: MessageService,
    private su: Sumt03Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.process = data.sumt03.detail;
      this.actions = data.sumt03.actions;
      this.master.processGroups = data.sumt03.master.processGroups;
      this.master.productionLocations = data.sumt03.master.productionLocations;
      this.rebuildForm();
    });
  }

  createProcessForm() {
    return this.fb.group({
      processName: [null, [Validators.required, Validators.maxLength(255)]],
      baseUom: [null, [Validators.maxLength(50)]],
      groupId: [null, [Validators.required]],
      locationId: [null, [Validators.required]],
      status: ['ACTIVE', [Validators.required]]
    });
  }

  createPricingTierForm() {
    return this.fb.group({
      minQty: [null, [Validators.required]],
      maxQty: [null],
      fixedCost: [0, [Validators.required]],
      variableRate: [0, [Validators.required]],
      variableUnitLabel: [null, [Validators.maxLength(50)]]
    });
  }

  rebuildForm() {
    this.processDataSource = new FormDatasource<ProductionProcess>(this.process, this.createProcessForm());
    if (this.process.id) {
      // Optional: disable fields if needed
    }

    this.pricingTierDataSources = [];
    if (this.process.pricingTiers) {
      this.process.pricingTiers.forEach(tier => {
        const dataSource = new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm());
        this.pricingTierDataSources.push(dataSource);
      });
    }
    this.pricingTiersDataSource.data = this.activePricingTiers;
  }

  addTier() {
    const tier = new ProcessPricingTier();
    tier.rowState = RowState.Add;
    const dataSource = new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm());
    this.pricingTierDataSources.push(dataSource);
    this.pricingTiersDataSource.data = this.activePricingTiers;
  }

  removeTier(dataSource: FormDatasource<ProcessPricingTier>) {
    this.modal.confirm('message.STD00003').subscribe(res => {
      if (res) {
        if (dataSource.isAdd) {
          const actualIndex = this.pricingTierDataSources.indexOf(dataSource);
          this.pricingTierDataSources.splice(actualIndex, 1);
        } else {
          dataSource.markForDelete();
        }
        this.pricingTiersDataSource.data = this.activePricingTiers;
      }
    });
  }

  get activePricingTiers() {
    return this.pricingTierDataSources.filter(ds => !ds.isDelete);
  }

  save() {
    this.util.markFormGroupTouched(this.processDataSource.form);
    if (this.processDataSource.form.invalid) return;

    if (this.pricingTierDataSources.some(ds => ds.form.invalid && !ds.isDelete)) {
      this.pricingTierDataSources.forEach(ds => {
        if (!ds.isDelete) this.util.markFormGroupTouched(ds.form);
      });
      this.ms.warning('message.STD00027');
      return;
    }

    this.processDataSource.updateValue();
    this.pricingTierDataSources.forEach(ds => ds.updateValue());

    this.process.pricingTiers = this.pricingTierDataSources.map(ds => ds.model);

    this.saving = true;
    this.su.save(this.process).pipe(
      switchMap((res: any) => this.su.getProcess(res.id))
    ).subscribe({
      next: (process) => {
        this.process = process;
        this.rebuildForm();
        this.ms.success('message.STD00006');
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  canDeactivate(): Observable<boolean> {
    if (this.processDataSource.form.dirty || this.pricingTierDataSources.some(ds => ds.form.dirty)) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }
}
