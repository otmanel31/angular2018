import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../metier/user';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthManagerService {

  private url:string = "http://localhost:8080/extended_api/auth";

  private currentUser: User;
  private userSubject: Subject<[boolean,User]>;

  //private

  constructor(/*private http: HttpClient*/) {
    this.currentUser = null;
    this.userSubject = new Subject<[boolean,User]>();
  }

  public getCurrentUser(): User{
    return this.currentUser;
  }
  public isRoleActive(roleName: string):boolean{
    if (this.currentUser == null || this.currentUser.roles == null) return false;
    if (this.currentUser.roles.findIndex(r=> r.name == roleName) != -1) return true;
    else return false;
  }

  public isLoggedIn():boolean{
    if (this.currentUser == null ) return false;
    return true;
  }

  public logMeIn(username:string, password:string):void{
    /*let newUser = new User(username, password);
    this.http.post<User>(`${this.url}/login`, newUser)
                .subscribe(u=>{
                  // le user nouveau devient le currentUser
                  this.currentUser = u;
                  // on previent du changement 
                  this.userSubject.next(u);
                });*/
  }

  public getUserAsObservable():Observable<[boolean,User]>{
    return this.userSubject.asObservable();
  }

  public getCredentials():string{

    // generation de la valeur des credentatials pour auth en base 64
    return window.btoa(this.currentUser.username +':' + this.currentUser.password);
  }

  setCurrentUser( u: User ):void{
    this.currentUser = u;
    // publication du nouveau user loggué
    this.userSubject.next([true, this.currentUser]);
  }

  public logOut():void {
    this.currentUser = null;
    // publication du fait quil ny a plus de user loggué
    this.userSubject.next([false, null]);
  }

}
