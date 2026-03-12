import { EntityBase } from "@app/shared/service/base.service"

export class DbDistrict extends EntityBase {
    districtId: number;
    provinceId: number;
    districtNameTHA: string;
    districtNameENG: string;
    active: boolean;
}



