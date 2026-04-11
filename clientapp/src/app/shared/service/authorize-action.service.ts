import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActionType } from "@app/core/model/action-type";
import { Observable, map, of } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthorizeActionService {

  constructor(private http: HttpClient) {}

  getActions(programCode: string): Observable<any> {
    return this.http.get<any>(`v1/permissions/actions`, { params: { menuCode: programCode } })
      .pipe(
        map(p => ({
          read: p.canRead,
          create: p.canCreate,
          edit: p.canEdit,
          delete: p.canDelete,
          cancel: p.canCancel,
          approve: p.canApprove,
          verify: p.canVerify,
          // Mapping for components that use these names
          Add: p.canCreate,
          Edit: p.canEdit,
          Delete: p.canDelete,
          Search: p.canRead
        }))
      );
  }

  saveaudit(menuCode: string, authorizeActionCode: ActionType, docNo: string, documentDate: Date): Observable<any> {
    // Do nothing for audit logging
    return of(null);
  }
}








