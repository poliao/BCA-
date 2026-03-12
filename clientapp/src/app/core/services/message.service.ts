import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private readonly toastr: ToastrService, private readonly translate: TranslateService) { }

    private readonly arrayToObject = (array: string[] = []): Record<number, string> =>
        array.reduce((obj: Record<number, string>, item, index) => Object.assign(obj, { [index]: item }), {});

    translatedParams(params: string[] = []): Observable<any> {
        const translated = params.map(item => this.translate.get(item)) as Observable<string>[];
        return forkJoin(translated)
            .pipe(map((params) => this.arrayToObject(params)))
    }

    translatedMessage(message: string, params: string[] | null = null): Observable<any> {
        return params != null && params.length > 0 ? this.translatedParams(params).pipe(
            switchMap(translated => this.translate.get(message, translated))
        ) : this.translate.get(message);
    }

    info(message: string, params: string[] | null = null): void {
        this.translatedMessage(message, params)
            .subscribe((translated) => this.toastr.info(translated, "Information"));
    }

    success(message: string, params: string[] | null = null): void {
        this.translatedMessage(message, params)
            .subscribe((translated) => this.toastr.success(translated, "Success"));
    }

    error(message: string, params: string[] | null = null): void {
        this.translatedMessage(message, params)
            .subscribe((translated) => this.toastr.error(translated, "Error", { timeOut: 3000, extendedTimeOut: 5000 }));
    }

    errorConcat(message: string): void {
        this.toastr.error(message, "Error", { enableHtml: true, timeOut: 3000, extendedTimeOut: 5000 });
    }

    warning(message: string, params: string[] | null = null): void {
        this.translatedMessage(message, params)
            .subscribe((translated) => this.toastr.warning(translated, "Warning", { timeOut: 3000, extendedTimeOut: 5000 }));
    }
}