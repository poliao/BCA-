import { EntityBase } from "@app/shared/service/base.service"

export class SuCompany extends EntityBase {
    companyCode: string;
    description: string;
    active: boolean;
    personalityType: string;
    taxNumber: string;
    branchCode: string;
    socialSecurityNumber: string;
    socialSecurityBranch: string;
    companyLogo: number;
    companyNameTha: string;
    companyNameEng: string;
    countryCode: string;
    provinceId: number;
    districtId: number;
    addressTha: string;
    addressEng: string;
    moo: string;
    soi: string;
    road: string;
    tambol: number;
    postalCode: string;
    telephoneNo: string;
    faxNo: string;
    email: string;
    personalTaxTypeCode: string;
    taxId: string;
    socailSecurityNo: string;
    socailSecurityBranch: string;
    receiptBranchCode: string;
    receiptBranchName: string;
    website: string;
    googleMap: string;
    logoName: string;
    mapName: string;
    bannerName: string;
    mainCompany: string;
    isBranch: boolean;
    revenueStampBranchNo: string;
    billPaymentFlag: boolean;
    comCode: string;
    suffixCode: string;
    isMobile: boolean;
    mapLatitude: number;
    mapLongitude: number;
    mapLocation: string;
    regionId: number;
    isCompanyTracking: boolean;
    corpIdKkp: string;
    originCode: string;
}

