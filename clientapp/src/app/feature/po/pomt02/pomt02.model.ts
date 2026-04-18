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
    active!: boolean;
}
