import { EntityBase } from "@app/shared/service/base.service";

export class Pomt02 extends EntityBase {
    id!: number;
    itemCode!: string;
    itemNameTh!: string;
    itemNameEn!: string;
    categoryCode!: string;
    minimumOrderQuantity!: number;
    unit!: string;
    leadTimeDays!: number;
    purchasePrice!: number;
    width?: number;
    length?: number;
    active!: boolean;
    sizes: Pomt02Size[] = [];
}

export class Pomt02Size extends EntityBase {
    id?: number;
    width!: number;
    length!: number;
    grams: Pomt02Gram[] = [];
}

export class Pomt02Gram extends EntityBase {
    id?: number;
    gram!: number;
    purchasePrice!: number;
}
