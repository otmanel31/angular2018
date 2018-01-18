import { Injectable } from '@angular/core';
import { User } from '../metier/user';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthManagerService {

  private url: string = "http://localhost:8080/extended_api/auth";

  private currentUser: User;
  // boolean est ce qon est logger ou pas 
  private userSubject: Subject<[boolean, User]>;

  constructor() {
    this.currentUser = null;
    this.userSubject = new Subject<[boolean, User]>();
  }

  public getUserAsObservable():Observable<[boolean, User]>{
    return this.userSubject.asObservable();
  }

  public getCurrentUser():User{
    return this.currentUser;
  }

  public setCurrentUser(u:User):void{
    this.currentUser = u;
    this.userSubject.next([true, u]);
  }

  public isLoggedIn():boolean{
    if (this.currentUser == null) return false;
    return true;
  }

  public logOut():void{
    this.currentUser = null;
    this.userSubject.next([false, null]);
  }

  public logMeIn(username:string, password:string):void{
    // inusé et faire directement dans le composant login suite a probleme de 
    // dependance circulaire lié au auth interceptor
  }

  public getCredentials():string{
    // generation de la valeur des credentatials pour auth en base 64
    return window.btoa(this.currentUser.username+':'+this.currentUser.password);
  }

}
