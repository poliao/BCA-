import { EntityBase } from "@app/shared/service/base.service";

export class Qtmt01 extends EntityBase {
  id!: number;
  quotationNo!: string;
  quotationDate!: Date;
  customerCode!: string;
  customerName!: string;
  taxId!: string;
  address!: string;
  jobName!: string;
  remarkInternal!: string;
  vatType!: string;
  isVatIncluded: boolean = false;
  vatRate!: number;
  deliveryCost: number = 0;
  operatingCost: number = 0;

  // New deeply nested hierarchy
  boxes: Qtmt01Box[] = [];
}

export class Qtmt01Box {
  boxId!: number;
  boxName!: string; // e.g. "กล่องครีม", "กล่องสบู่"
  
  // Quantities for this specific box
  orderQuantities: number[] = []; 
  
  // The physical components of this box
  parts: Qtmt01Part[] = [];
}

export class Qtmt01Part {
  partId!: number;
  partName!: string; // e.g. "ตัวกล่อง", "ฝาครอบ", "ไส้ใน"
  productionLocationId!: number;
  
  // Material & Layout Details
  paperId!: number;
  paperSizeId!: number;
  paperGramId!: number;
  
  isCutBasePaper: boolean = false;
  paperCutPieces!: number;
  paperCutWidth!: number;
  paperCutLength!: number;
  
  layQty!: number;
  layHorizontal!: number;
  layVertical!: number;
  wastageSheets: number = 0;

  // Printing
  printProcessId!: number;
  printStyle!: string; // "หน้าเดียว", "กลับนอก", "กลับในตัว"
  printColorFront!: number;
  printColorBack!: number;
  printCutSizeFront!: string;
  printCutSizeBack!: string;

  // Corrugated specifically set at Part level for maximum flexibility
  isCorrugated!: boolean;
  fluteType!: string;

  // Finishing
  coatingType!: string;

  // Coating batches: each batch = 1 optional cut step → 1+ coating processes
  coatings: {
    id?: number;
    isCutBeforeCoating?: boolean;
    coatingCutPieces?: number;
    coatingCutWidth?: number;
    coatingCutLength?: number;
    items?: { id?: number; coatingProcessId?: number; coatingNote?: string }[];
  }[] = [];

  // Stamp entries (บล็อคปั้ม): each entry = 1 batch of stamp operations
  stampEntries: {
    id?: number;
    stampProcessId?: number;      // Process id from SUMT03 group "บล็อคปั้ม"
    stampSizeSelected?: string;   // stampSize from pricingTier of selected process
    batchNote?: string;
    items?: {
      id?: number;
      stampItemProcessId?: number; // Process id from SUMT03 group "ปั้ม"
      width?: number;
      length?: number;
      stampNote?: string;
    }[];
  }[] = [];

  // Gluing entries
  gluings: {
    id?: number;
    gluingProcessId?: number;
    gluingNote?: string;
  }[] = [];
}