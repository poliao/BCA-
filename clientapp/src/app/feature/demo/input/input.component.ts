import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '@app/core/services/message.service';
import { Content } from '@app/shared/components/attachment/content-upload.service';
import { LookupSource } from '@app/shared/components/lookup/lookup.source';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { StatusColor } from '@app/shared/components/status/color';
import { TypeaheadSource } from '@app/shared/components/typeahead/typeahead.source';
import { FormDatasource } from '@app/shared/service/base.service';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';
import { AttachmentDemo, InputService } from './input.service';
import { MultipleFileModalComponent } from './multiple-file-modal/multiple-file-modal.component';
import { SingleLookupComponent } from './single-lookup/single-lookup.component';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html'
})
export class InputComponent implements OnInit {
  inputForm!: FormGroup;
  color = StatusColor;
  typeaheadSource!: TypeaheadSource;
  lookupSource!: LookupSource;
  lookupText = null;

  fileArrForm: FormDatasource<AttachmentDemo>[] = [];
  fileDataSource!: MatTableDataSource<FormDatasource<AttachmentDemo>>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly ms: MessageService,
    private readonly is: InputService,
    private readonly modal: ModalService
  ) { }

  items = [{ value: '01', text: '01', description: 'description : 01' }, { value: '02', text: '02', description: 'description : 02' }];
  itemInserts = [{ value: '01', text: '01', description: 'description : 01' }, { value: '02', text: '02', description: 'description : 02' }];
  itemsObserv = new BehaviorSubject<any[]>([]);
  radioItems = [{ value: '01', text: 'Option1' }, { value: '02', text: 'Option2' }];

  ngOnInit(): void {
    this.typeaheadSource = new TypeaheadSource((term, value) => this.is.getTypeahead(term, value));
    this.lookupSource = new LookupSource((term, value) => this.is.getLookup(term, value));
    this.fileDataSource = new MatTableDataSource<FormDatasource<AttachmentDemo>>([]);

    this.inputForm = this.fb.group({
      text: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.email]],
      number: [null, [Validators.required, Validators.min(10), Validators.max(1000)]],
      currency: [null, [Validators.required, Validators.min(9.99), Validators.max(1000.50)]],
      date: [null, Validators.required],
      time: [null, Validators.required],
      select: [null, Validators.required],
      selectTag: [null, Validators.required],
      selectObserv: [null, Validators.required],
      selectMultiple: [['01', '02'], Validators.required],
      selectDesc: [null, Validators.required],
      selectCustom: [null, Validators.required],
      typeahead: ['STD00004', Validators.required],
      radio: ['01'],
      radioCheck: null,
      radioButton: null,
      check: [false],
      mon: [true],
      tues: [true],
      lookup: [null],
      area: [null, Validators.required],
      image: [null, Validators.required],
      file: [null, Validators.required],
      import: [null, Validators.required]
    });

    this.inputForm.controls.select.valueChanges
      .subscribe(value => {
        this.itemsObserv.next([]);
        if (this.inputForm.controls.select.dirty)
          this.inputForm.controls.selectObserv.setValue(null);
        if (value)
          this.is.getDependency('example', { code: value })
            .subscribe(dependency => {
              this.itemsObserv.next(dependency.examples);
            });
      });

    this.inputForm.controls.lookup.valueChanges
      .pipe(switchMap(value => this.lookupSource.getModel(value)))
      .subscribe((model: any) => {
        this.lookupText = model.text;
      });
    this.inputForm.controls.lookup.setValue('su');
  }

  onOpenLookup = (value: any) => {
    return this.modal.open(SingleLookupComponent, { keyword: value });
  }

  search(value: string) {
    console.log(value);
    this.inputForm.controls.image.disable();
  }

  getValue() {
    const values = this.inputForm.value;
    return JSON.stringify(values, (key: string, value: any) => {
      if (values[key] instanceof Date) {
        return values[key].toString();
      } return value;
    }, 2)
  }

  addTagPromise = (text: string) => {
    return firstValueFrom(this.is.saveTag(text));
  }

  save() {
    this.ms.success('success');
  }

  clear() {
    this.inputForm.reset();
  }

  createFileForm(): FormGroup {
    const fg = this.fb.group({
      attachId: [null],
      name: [null],
      remark: [null]
    });

    return fg;
  }

  reload(): void {
    this.fileDataSource.data = this.fileArrForm.filter(o => !o.isDelete);
  }

  addFile(id: number = null): void {
    const attach = new AttachmentDemo();
    if (id) {
      attach.attachId = id;
    }
    const fileForm = new FormDatasource<AttachmentDemo>(attach, this.createFileForm());
    this.fileArrForm.push(fileForm);
    this.reload();
  }

  openModal(): void {
    this.modal.open(MultipleFileModalComponent, {}, Size.Large).subscribe((res: Content[]) => {
      if (res || res.length !== 0) res.forEach(file => this.addFile(file.id));
    });
  }

  removeFile(data: FormDatasource<AttachmentDemo>): void {
    data.markForDelete();
    this.reload();
  }
}
