import { EntityBase } from "@app/shared/service/base.service"

export class DbSubDistrict extends EntityBase {
    subDistrictId: number;
    districtId: number;
    subDistrictNameTHA: string;
    subDistrictNameENG: string;
    active: boolean;
}



