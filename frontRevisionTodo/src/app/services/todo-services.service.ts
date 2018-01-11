import { Injectable } from '@angular/core';
import { Todo } from '../metier/todo';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { Pageable } from '../metier/pageable';

@Injectable()
export class TodoServicesService {
  //private todoSubject : BehaviorSubject<Todo[]>;
  private todoSubject : BehaviorSubject<Pageable<Todo>>;
  private searchTerm: string;
  private typeSearch: string;
  private noPage: number;
  private libelleForDouble: string;

  constructor(private http: HttpClient){
    this.todoSubject = new BehaviorSubject(new Pageable([],0,0,5,0,1,true, false, null));
    this.searchTerm = "";
    this.typeSearch = "";
    this.noPage = 0; 
    this.libelleForDouble = "";
  }

  // public refreshListe():void{
  //   //let parametres = new HttpParams();
  //   //parametres.append(this.typeSearch, this.searchTerm);
  //   let prm = new URLSearchParams();
  //   prm.append(this.typeSearch, this.searchTerm);
  //   let url = "http://localhost:8080/todoList/todos";
  //   // if (this.searchTerm != "" ){
  //   //   url += `/search?${this.typeSearch}=${this.searchTerm}`;
  //   // }

  //   this.http.get<Todo[]>(url, {params: new HttpParams().set(this.typeSearch, this.searchTerm)}).toPromise().then(todos=>this.todoSubject.next(todos)).catch(err=> console.error(err));
  // }
  public refreshListe():void{
    let parametres = new HttpParams();
    if (this.libelleForDouble != "") parametres = parametres.set("libelle", this.libelleForDouble);
    if (this.searchTerm != "") parametres = parametres.set(this.typeSearch, this.searchTerm);
    // let prm = new URLSearchParams();
    // prm.append(this.typeSearch, this.searchTerm);
    let url = "http://localhost:8080/todoList/ptodos"; //ptodos et nn todos pour paginate
    
    parametres = parametres.set("page", this.noPage.toString());
    this.http.get<Pageable<Todo>>(url, {params: parametres})
      .toPromise()
      .then(todos=>this.todoSubject.next(todos)).catch(err=> console.error(err));
  }

  // public listeTodos():Observable<Todo[]>{
  //   return this.todoSubject.asObservable();
  // }
  public listeTodos():Observable<Pageable<Todo>>{
    return this.todoSubject.asObservable();
  }

  public findById(id: number):Promise<Todo>{
    let url = `http://localhost:8080/todoList/todos/${id}`;
    return this.http.get<Todo>(url).toPromise();
  }

  public save(t:Todo):Promise<Todo>{
    let url = "http://localhost:8080/todoList/todos";
    let option = {headers: new HttpHeaders({"Content-Type":"application/json"})};

    if (t.id == 0){
        return this.http.post<Todo>(url, t, option).toPromise();
    }else{
      return this.http.put<Todo>(url, t, option).toPromise();
    }
  }

  public delete(id: number):Promise<Todo>{
    let url = "http://localhost:8080/todoList/todos/"+id;
    return this.http.delete<Todo>(url).toPromise();

  }

  public changeSearch(term: string, type:string):void{
    this.typeSearch = type;
    if (type == "libelle") this.libelleForDouble = term;
    this.searchTerm = term;
    this.refreshListe();
  }

  setNoPage(noPage: number):void{
    this.noPage = noPage;
    this.refreshListe();
  }
}
