import { EntityBase } from "@app/shared/service/base.service"

export class DbEmployee extends EntityBase {
  employeeCode: string
    companyCode: string
    branchCode: string
    divisionCode: string
    profileImageId: number
    userId: number
    email: string
    mobileNo: string
    prefixId: number
    firstName: string
    lastName: string
    positionCode: string
    idCard: string
    passportNo: string
    religionCode: string
    nationalityCode: string
    raceCode: string
    countryCode: string
    provinceId: number
    districtId: number
    address: string
    postalCode: string
    firstNameEn: string
    lastNameEn: string
    isMobile: boolean
    financialAmount: number
    status: boolean
    signatureImgPath: string
    mgmTarget: MGM[]
    insuranceLicenseNo: string
    insuranceEntityCode: string
    subCompany: string
}

export class MGM extends EntityBase {
    employeeMgmTargetId: number;
    year: string;
    monthCode: string;
    target: number;
    RowVersion: number
    RowState: number
  }
  export class PcmUser extends EntityBase {
    employeeMgmTargetId: number;
    year: string;
    monthCode: string;
    target: number;
    RowVersion: number
    RowState: number
  }

