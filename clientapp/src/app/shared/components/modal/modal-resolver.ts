import { Observable } from 'rxjs';

export interface ModalResolve<T> {
    resolve(resolverParam?: Object): Observable<T>
}