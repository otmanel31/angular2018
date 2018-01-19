import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AlertManagerService {

  private alertSubject: Subject<[string, string]>;

  constructor() {
    this.alertSubject = new Subject();
  }

  public alertAsObservable(): Observable<[string, string]>{
    return this.alertSubject.asObservable();
  }

  public handleErrorResponse(error: HttpErrorResponse):void{
    console.log('in handle error resonse => ' + error.status)
    if (error.status == 401) return; // deja intercepté
    if (error.status == 403) {
      this.alertSubject.next([ "danger", "access denied" + error.message]);
      return;
    }
    if (error.status == 404) {
      this.alertSubject.next(["warning", "content not find, please retry"]);
      return;
    }
    if (error.status == 500) {
      this.alertSubject.next(["warning", "server is burning, call fireman => " + error.message]);
      return;
    }
    else{

        this.alertSubject.next(["warning", "autres aerreurs ....  " ]);
        return;
      
    }
  }

  handleSuccessResponse(type:string, message:string):void{
    this.alertSubject.next([type, message]);
  }

}
