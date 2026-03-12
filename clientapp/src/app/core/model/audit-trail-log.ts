import { ActionType } from './action-type';

export interface AuditTrailLog {
  UserName: string;
  SystemCode: string;
  AuthorizeActionCode: ActionType;
  AuditTrailLogDate: Date;
  MenuCode: string;
  DocumentDate: Date;
  DocumentNo: string;
  DocumentType: string;
}
