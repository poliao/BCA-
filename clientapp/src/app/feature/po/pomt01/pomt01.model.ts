import { EntityBase } from "@app/shared/service/base.service"

export class Pomt01 extends EntityBase {
    id!: number;
    categoryCode!: string;
    categoryNameTh!: string;
    categoryNameEn!: string;
    parentCategoryCode!: string;
    active!: boolean;
    sequence!: number;
}

export interface CategoryNode {
    id: number;
    categoryCode: string;
    categoryNameTh: string;
    categoryNameEn: string;
    parentCategoryCode: string;
    active: boolean;
    sequence: number;
    children?: CategoryNode[];
}
