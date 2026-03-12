import { RowState } from "@app/shared/constants"
import { EntityBase } from "@app/shared/service/base.service"

export class SuProfile extends EntityBase {
    profileCode: string
    description: string
    active: boolean
    profileLangs: SuProfileLang[]
    profileMenus: SuProfileMenu[]
}

export class SuProfileLang extends EntityBase {
    profileCode: string
    languageCode: string
    langName: string
    profileName: string
}

export class SuProfileMenu extends EntityBase {
    profileCode: string
    languageCode: string
    menuCode: string
    menuName: string
    systemCode: string
    authorize: Authorize[]
}

export class Authorize extends EntityBase {
    description: string
    systemCode: string
    authorizeActionCode: string
    flag: boolean
    RowState: number
    RowVersion: number
}



export type Sumt04SearchType = 'profileAuthorize' | 'profileMenu'
