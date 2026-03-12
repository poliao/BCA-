import { EntityBase } from "@app/shared/service/base.service"

export class Dbdepartment extends EntityBase {
  departmentCode: string;
  departmentNameTha: string;
  departmentNameEng: string;
  departmentParent: string | null;
  departmentAbbreviation: string;
  active: boolean;
  departmentCompany: Dbdepartmentcompany[];
}
export class Dbdepartmentcompany extends EntityBase {
  companyCode: string;
}

