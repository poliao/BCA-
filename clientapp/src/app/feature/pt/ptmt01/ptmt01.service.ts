import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileService } from '@app/shared/service/file.service';

@Injectable()
export class Dbmt01Service {

  constructor(private http: HttpClient, private fs: FileService) {
  }

}
