import { EntityBase } from "@app/shared/service/base.service"

export class DbCountry extends EntityBase {
  countryCode: string;
  countryNameTha: string;
  countryNameEng: string;
  active: boolean;
}

