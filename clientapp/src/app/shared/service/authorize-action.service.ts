import { Injectable } from "@angular/core";
import { ActionType } from "@app/core/model/action-type";
import { Observable, of } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthorizeActionService {

  constructor() {}

  getActions(programCode: string): Observable<any> {
    // Return a default object that implies all actions are authorized
    return of({
      Add: true,
      Edit: true,
      Delete: true,
      Search: true,
      Export: true,
      Print: true,
      Report: true
    });
  }

  saveaudit(menuCode: string, authorizeActionCode: ActionType, docNo: string, documentDate: Date): Observable<any> {
    // Do nothing for audit logging
    return of(null);
  }
}








