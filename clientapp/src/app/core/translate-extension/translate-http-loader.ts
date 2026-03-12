import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LazyTranslationService } from './lazy-translation.service';

export const isObject = (item: Object) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export const mergeDeep = (target: Object, ...sources: any) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export class TranslateHttpLoader implements TranslateLoader {
    constructor(private lazy: LazyTranslationService) { }
    /**
     * Gets the translations from the server
     */
    public getTranslation(lang: string): Observable<Object> {
        // load translation of all added modules.
        this.lazy.translationLoaded = true;
        const requests = this.lazy.loadByLang(lang);
        let result = {};

        return forkJoin(requests).pipe(map(response => {
            response.forEach(res => {
                result = mergeDeep(result, res);
            })
            return mergeDeep(result, this.lazy.getLoadedTranslate(lang));
        }));
    }
}