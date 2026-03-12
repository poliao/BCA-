import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { SuPasswordPolicy, Sumt05Service } from './sumt05.service';

@Component({
  selector: 'app-sumt05-detail',
  templateUrl: './sumt05-detail.component.html'
})
export class Sumt05DetailComponent extends SubscriptionDisposer implements OnInit {

  policy: SuPasswordPolicy = { } as SuPasswordPolicy;

  policyDataSource!: FormDatasource<SuPasswordPolicy>;

  saving = false;
  actions: any;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal:ModalService,
    private ms: MessageService,
    private su: Sumt05Service) {
    super();
  }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.policy = data.sumt05.detail;
      this.actions = data.sumt05.actions;
      this.rebuildForm();
    });
  }


  createMenuForm(policy: SuPasswordPolicy) {
    const fg = this.fb.group({
      passwordPolicyCode: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(Pattern.UpperOnly)]],
      passwordPolicyName: [null, [Validators.required, Validators.maxLength(100)]],
      passwordPolicyDescription: [null, Validators.maxLength(200)],
      failTime: [null, [Validators.maxLength(4), Validators.min(0), Validators.max(9999)]],
      passwordAge: [null, [Validators.maxLength(4), Validators.min(0), Validators.max(9999)]],
      passwordMinimumLength: [null, [Validators.maxLength(4), Validators.min(0), Validators.max(9999)]],
      passwordMaximumLength: [null, [Validators.maxLength(4), Validators.min(0), Validators.max(9999)]],
      passwordHistory: [null, [Validators.maxLength(4), Validators.min(0), Validators.max(9999)]],
      usingUppercase: false,
      usingLowercase: false,
      usingNumericChar: false,
      usingSpecialChar: false
    })

    return fg;
  }

  rebuildForm() {
    this.policyDataSource = new FormDatasource<SuPasswordPolicy>(this.policy,this.createMenuForm(this.policy));
    if (this.policy.rowVersion) {
      this.policyDataSource.form.controls.passwordPolicyCode.disable();
    }
  }

  save(){

     this.util.markFormGroupTouched(this.policyDataSource.form)
     if(this.policyDataSource.form.invalid) return;

     this.policyDataSource.updateValue();
     this.su.save(this.policy).pipe(
       switchMap(()=>this.su.getPolicy())
     ).subscribe(policy=>{
        this.policy = policy;
        this.rebuildForm();
        this.ms.success('message.STD00006');
     })
  }

  canDeactivate(): Observable<boolean> {
    if (this.policyDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }
}
