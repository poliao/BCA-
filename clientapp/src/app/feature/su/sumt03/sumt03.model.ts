import { EntityBase } from "@app/shared/service/base.service"

export interface ProcessGroup extends EntityBase {
    id: number;
    groupName: string;
    displayOrder: number;
}

export interface ProductionLocation extends EntityBase {
    id: number;
    locationName: string;
    locationType: string;
}

export class ProductionProcess extends EntityBase {
    id: number;
    processName: string;
    baseUom: string;
    groupId: number;
    locationId: number;
    status: string = 'ACTIVE';
    pricingTiers: ProcessPricingTier[] = [];

    // UI Only properties
    groupName?: string;
    locationName?: string;
}

export class ProcessPricingTier extends EntityBase {
    id: number;
    processId: number;
    minQty: number;
    maxQty: number | null;
    fixedCost: number = 0;
    variableRate: number = 0;
    variableUnitLabel: string;
}