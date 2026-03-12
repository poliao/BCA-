import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "@app/shared/service/configuration.service";
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from "rxjs";
import { Category } from "./category";

export enum Type {
    Image = "Image",
    File = "File"
}

export type Content = {
    id: number;
    name: string;
    container: string;
    path: string | ArrayBuffer;
    loading?: boolean;
}

export type ContentPath = {
    DisplayUrl: string,
    ApiUrl: string,
}

export class Configuration {
    DisplayPath: string;
    MaxFileSize: number;
}

@Injectable()
export class ContentUploadService {

    private config = new BehaviorSubject<Configuration>(new Configuration());
    constructor(private readonly http: HttpClient, private readonly cs: ConfigurationService) { }

    getContentUrl(): Observable<ContentPath> {
        return this.cs.getConfiguration('Content');
    }

    getContent(id: number) {
        return this.getContentUrl().pipe(
            switchMap(path => this.http.disableApiPrefix().skipErrorHandler().disableLoading().get<Content>(`${path.ApiUrl}/api/content`, { params: { id: id } }).pipe(
                map(content => {
                    content.path = `${path.DisplayUrl}/${content.container}/${String(content.path)}`
                    return content;
                })
            )),
            catchError(() => {
                return of({} as Content)
            })
        )
    }

    upload(file: File, type: Type, category: Category): Observable<Content | HttpEvent<Content>> {
        const formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("category", category || Category.Default);
        return this.getContentUrl().pipe(
            switchMap(path => this.http.disableApiPrefix().skipErrorHandler().disableLoading().post<Content>(`${path.ApiUrl}/api/content`, formData, {
                reportProgress: true,
                observe: 'events'
            }).pipe(
                map(event => {
                    if (event.type == HttpEventType.Response) {
                        const content = event.body;
                        content.path = `${path.DisplayUrl}/${content.container}/${String(content.path)}`
                        return content;
                    }
                    return event;
                })
            ))
        )
    }

    public configChanged(): Observable<Configuration> {
        return this.config.asObservable();
    }
}