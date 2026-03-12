import { EntityBase } from "@app/shared/service/base.service"

export class DbProvince extends EntityBase {
    provinceId: number;
    countryCode: string;
    provinceNameTHA: string;
    provinceNameENG: string;
    active: boolean;
}



