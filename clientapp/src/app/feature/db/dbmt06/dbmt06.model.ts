import { EntityBase } from "@app/shared/service/base.service"

export class DbPrefix extends EntityBase {
  PrefixId: number;
  PrefixNameTha: string;
  PrefixNameEng: string;
  SuffixNameTha: string;
  SuffixNameEng: string;
  PersonalityType: string;
  Active: boolean;
  Description: string;
  RowVersion: number;
}