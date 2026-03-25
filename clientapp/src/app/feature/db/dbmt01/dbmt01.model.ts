import { EntityBase } from "@app/shared/service/base.service";

export class DbLanguage extends EntityBase {
    id: number;
    languageCode: string;
    languageName: string;
    isActive: boolean;
}
