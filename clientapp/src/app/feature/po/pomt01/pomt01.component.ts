import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Pomt01Service } from './pomt01.service';
import { Pomt01, CategoryNode } from './pomt01.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  templateUrl: './pomt01.component.html',
  styleUrls: ['./pomt01.component.scss']
})
export class Pomt01Component implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  actions: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private po: Pomt01Service,
    private ms: MessageService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.pomt01.actions;
      this.refreshTree();
    });
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  refreshTree() {
    this.po.getAllCategories().subscribe(res => {
      this.dataSource.data = this.buildTree(res);
    });
  }

  buildTree(flatList: Pomt01[]): CategoryNode[] {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    flatList.forEach(item => {
      map.set(item.categoryCode, { ...item, children: [] });
    });

    flatList.forEach(item => {
      const node = map.get(item.categoryCode)!;
      if (item.parentCategoryCode && map.has(item.parentCategoryCode)) {
        map.get(item.parentCategoryCode)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  add(parentCode?: string) {
    this.router.navigate(['/po/pomt01/detail'], { state: { parentCategoryCode: parentCode } });
  }

  edit(row: Pomt01) {
    this.router.navigate(['/po/pomt01/detail'], { state: { id: row.id } });
  }

  remove(row: Pomt01) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.po.delete(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      this.refreshTree();
    });
  }
}