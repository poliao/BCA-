import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { SuUser, SuRole, SuRolePermission } from './sumt02.model';
import { Sumt02Service } from './sumt02.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { RowState } from '@app/shared/constants';

@Component({
  selector: 'app-sumt02-detail',
  templateUrl: './sumt02-detail.component.html'
})
export class Sumt02DetailComponent extends SubscriptionDisposer implements OnInit {
  user: SuUser = {} as SuUser;
  userDataSource!: FormDatasource<SuUser>;
  
  roles: SuRole[] = [];
  selectedRole: SuRole | null = null;
  roleDataSource: FormDatasource<SuRole> | null = null;
  
  // Tree for Permissions
  treeControl = new NestedTreeControl<SuRolePermission>(node => node.children);
  permissionDataSource = new MatTreeNestedDataSource<SuRolePermission>();
  
  actions: any;
  saving = false;
  showPassword = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly modal: ModalService,
    private readonly ms: MessageService,
    private readonly su: Sumt02Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt02.actions;
      this.user = data.sumt02.detail;
      this.roles = data.sumt02.master.roles || [];
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.userDataSource = new FormDatasource<SuUser>(this.user, this.createUserForm());
    if (this.user.id) {
       this.userDataSource.form.controls.username.disable({ emitEvent: false });
    }
  }

  createUserForm() {
    return this.fb.group({
      id: [null],
      username: [null, [Validators.required, Validators.maxLength(100)]],
      password: [null, this.user.id ? [] : [Validators.required]],
      firstName: [null, [Validators.required, Validators.maxLength(100)]],
      lastName: [null, [Validators.required, Validators.maxLength(100)]],
      isActive: [true],
      rowVersion: [null]
    });
  }

  createRoleForm() {
    return this.fb.group({
      id: [null],
      roleCode: [null, [Validators.required, Validators.maxLength(50)]],
      roleName: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(255)]],
      isActive: [true],
      rowVersion: [null]
    });
  }

  // --- Role & Permission Management ---

  selectRole(role: SuRole) {
    this.selectedRole = role;
    this.roleDataSource = new FormDatasource<SuRole>(this.selectedRole, this.createRoleForm());
    this.loadPermissionTree(role.id);
  }

  onRoleChange(roleId: number) {
    const role = this.roles.find(r => r.id === roleId);
    if (role) {
      this.selectRole(role);
    }
  }

  addNewRole() {
    const newRole = new SuRole();
    newRole.rowState = RowState.Add;
    this.selectedRole = newRole;
    this.roleDataSource = new FormDatasource<SuRole>(newRole, this.createRoleForm());
    this.loadPermissionTree(null);
  }

  loadPermissionTree(roleId: any) {
    this.su.getPermissionTree(roleId).subscribe(tree => {
      this.permissionDataSource.data = tree;
      this.treeControl.dataNodes = tree;
      this.treeControl.expandAll();
    });
  }

  hasChild = (_: number, node: SuRolePermission) => !!node.children && node.children.length > 0;

  // --- User-Role Assignments ---

  toggleUserRole(role: SuRole, event: any) {
    const checked = event.target.checked;
    if (checked) {
       if (!this.user.roles.find(r => r.id === role.id)) {
          this.user.roles.push(role);
       }
    } else {
       this.user.roles = this.user.roles.filter(r => r.id !== role.id);
    }
    this.userDataSource.form.markAsDirty();
  }

  isRoleSelected(roleId: number): boolean {
    return !!this.user.roles && this.user.roles.some(r => r.id === roleId);
  }

  // --- Saving ---

  save() {
    if (this.userDataSource.form.invalid) {
      this.util.markFormGroupTouched(this.userDataSource.form);
      return;
    }

    this.userDataSource.updateValue();
    this.saving = true;

    // If we're editing a role/permissions in the tab, we should handle that too?
    // For now, let's focus on saving the user.
    // The user requested a "centralized" place, so maybe we save both?
    
    const observables: any = {
       user: this.su.saveUser(this.user)
    };

    if (this.selectedRole && (this.roleDataSource?.dirty || this.isTreeDirty())) {
        this.roleDataSource?.updateValue();
        this.selectedRole.permissions = this.flattenTree(this.permissionDataSource.data);
        observables.role = this.su.saveRole(this.selectedRole);
    }

    forkJoin(observables).subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.rebuildForm();
        if (res.role) {
           this.su.getRoles().subscribe(res => this.roles = res.rows);
        }
        this.ms.success('message.STD00006');
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  isTreeDirty(): boolean {
     // Simplistic check for demo
     return true; 
  }

  flattenTree(nodes: SuRolePermission[]): SuRolePermission[] {
    let result: SuRolePermission[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(this.flattenTree(node.children));
      }
    }
    return result;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.userDataSource.form.dirty || this.roleDataSource?.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }
}
