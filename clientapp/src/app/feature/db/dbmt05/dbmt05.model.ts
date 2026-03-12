import { EntityBase } from "@app/shared/service/base.service"

export class DbBankAccountType extends EntityBase {
  BankAccountTypeCode: string;
  BankAccountTypeDescription: string;
  Active: boolean;
}