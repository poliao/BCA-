import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, switchMap } from 'rxjs';
import { SuConfiguration, Surt04Service } from './surt04.service';

@Component({
  selector: 'app-surt04-detail',
  templateUrl: './surt04-detail.component.html'
})
export class Surt04DetailComponent implements OnInit {

  config: SuConfiguration = {} as SuConfiguration;
  configDataSource!: FormDatasource<SuConfiguration>;
  saving = false;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    private ms: MessageService,
    private su: Surt04Service) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.config = data.surt04;
      this.configDataSource = new FormDatasource<SuConfiguration>(this.config, this.createParameterForm());
    });
  }

  createParameterForm() {
    const fg = this.fb.group({
      configValue: [null, [Validators.required, Validators.maxLength(200)]],
      remark: [null, [Validators.maxLength(200)]],
    })
    return fg;
  }

  save() {
    this.util.markFormGroupTouched(this.configDataSource.form)
    if (this.configDataSource.form.invalid) return;

    this.configDataSource.updateValue();
    this.su.save(this.config).pipe(
      switchMap(() => this.su.getConfiguration(this.config.configGroupCode, this.config.configCode))
    ).subscribe(config => {
      this.config = config;
      this.configDataSource = new FormDatasource<SuConfiguration>(this.config, this.createParameterForm());
      this.ms.success('message.STD00006');
    })
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (this.configDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }
}
