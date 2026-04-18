import { EntityBase } from "@app/shared/service/base.service";

export class Qtmt01 extends EntityBase {
  id: number;
  quotationNo: string;
  quotationDate: Date;
  expiryDate: Date;
  customerCode: string;
  customerName: string;
  contactName: string;
  contactPhone: string;
  address: string;
  branchType: string;
  zipCode: string;
  taxId: string;
  remark: string;
  jobName: string;
  jobType: string;
  
  // Financial Summary
  totalCost: number;
  totalAmount: number;
  vatRate: number = 7;
  vatAmount: number;
  whtRate: number;
  whtAmount: number;
  grandTotal: number;
  profitAmount: number;
  profitMarginPercent: number;

  papers: Qtmt01Paper[] = [];
  printings: Qtmt01Print[] = [];
  coatings: Qtmt01Coating[] = [];
  stamps: Qtmt01Stamp[] = [];
  gluing: Qtmt01Glue[] = [];
  folding: Qtmt01Fold[] = [];
  designs: Qtmt01Design[] = [];
}

export class Qtmt01ItemBase extends EntityBase {
  id: number;
  productName: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  marginPercent: number;
  unitPrice: number;
  amount: number;
}

export class Qtmt01Paper extends Qtmt01ItemBase {
  gsm: string;
  paperSize: string;
  paperType: string;
}

export class Qtmt01Print extends Qtmt01ItemBase {
  colorCount: string;
  sides: string;
}

export class Qtmt01Coating extends Qtmt01ItemBase {
  coatingType: string;
}

export class Qtmt01Stamp extends Qtmt01ItemBase {
  stampType: string;
}

export class Qtmt01Glue extends Qtmt01ItemBase {
  glueType: string;
}

export class Qtmt01Fold extends Qtmt01ItemBase {
  foldType: string;
}

export class Qtmt01Design extends Qtmt01ItemBase {
  designComplexity: string;
}