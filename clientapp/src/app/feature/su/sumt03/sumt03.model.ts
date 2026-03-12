import { EntityBase } from "@app/shared/service/base.service"

export class SuMenu extends EntityBase {
    menuCode: string
    programCode: string
    mainMenu: string
    systemCode: string
    icon: string
    active: boolean
    menuLabels: SuMenuLabel[]
}

export class SuMenuLabel extends EntityBase {
    menuCode: string
    languageCode: string
    langName: string
    menuName: string
    systemCode: string
}