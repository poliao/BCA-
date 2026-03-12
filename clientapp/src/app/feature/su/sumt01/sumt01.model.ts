import { EntityBase } from "@app/shared/service/base.service"

export class SuSystem extends EntityBase {
    systemId: number
    systemNameTH: string
    systemNameENG: string
    systemCode: string
    active: boolean
}

