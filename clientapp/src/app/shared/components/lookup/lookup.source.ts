
import { BehaviorSubject, finalize, first, map, mergeMap, Observable, of, tap } from "rxjs";

export class LookupSource {
    private loadingSubject!: BehaviorSubject<boolean>;
    public bindValue = 'value';
    private onSearch!:(term: any, value?: any) => Observable<any[]>;
    private loadedDatas:any[] = [];
    private model = {};
    constructor(onSearch: (term: any, value?: any) => Observable<any[]>,bindValue:string = 'value') {
        this.onSearch = onSearch;
        this.bindValue = bindValue;
        this.loadingSubject = new BehaviorSubject<boolean>(false);
    }

    setLoadedDatas(loadedData:any){
      this.loadedDatas = [loadedData];
    }

    getModel(value){
        if(value){
            if (!this.loadingSubject.getValue()) {
                if (Object.keys(this.model).length && this.model[this.bindValue] === value) {
                    return of(this.model);
                }
                else{
                    const item = this.loadedDatas.find(item => item[this.bindValue] === value)
                    if (item) {
                        this.model = item;
                        return of(this.model);
                    }
                    else {
                        this.loadingSubject.next(true);
                        return this.onSearch(null, value).pipe(
                            mergeMap(items => {
                                this.model = items[0] || {}
                                return of(this.model);
                            }),
                            finalize(() =>  this.loadingSubject.next(false))
                        )
                    }
                }
            }
            else {
                return this.loadingSubject.pipe(
                    first(loading => loading == false),
                    map(() => this.model)
                )
            }
        }
        else{
            this.model = {};
            return of(this.model);
        }
    }

    getData(term){
       return this.onSearch(term,null).pipe(
           tap(result=>this.loadedDatas = result)
       )
    }
}