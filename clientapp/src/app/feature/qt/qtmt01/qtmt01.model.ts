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
  
  // Material
  paperId!: number;
  paperSize!: string;

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

  // Stamps array specifically for this part
  stamps: any[] = [];
}