import { EntityBase } from "@app/shared/service/base.service";

export class SuMenu extends EntityBase {
    id!: number;
    menuCode!: string;
    menuName!: string;
    url!: string;
    icon!: string;
    parentId!: number;
    sequence!: number;
}
