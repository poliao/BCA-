import { EntityBase } from "@app/shared/service/base.service";

export class SuMenu extends EntityBase {
    id!: number;
    menuCode!: string;
    menuNameEn!: string;
    menuNameTh!: string;
    url!: string;
    icon!: string;
    parentMenuCode!: string;
    sequence!: number;
}
