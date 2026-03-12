import { RowState } from "@app/shared/constants";
import { EntityBase } from "@app/shared/service/base.service"

export class Bank extends EntityBase {
    bankcode: string;
    banknametha: string;
    banknameeng: string;
    active: boolean;
    rowversion: string;
    bankbranch: BankBranch[];
    transferbankcode: string;
  }
  
  export class BankBranch extends EntityBase {
    bankcode: string;
    branchcode: string;
    branchnametha: string;
    branchnameeng: string;
    active: boolean;
    rowversion: string;
    rowstate: RowState;
  }



