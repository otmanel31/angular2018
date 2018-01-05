import { Injectable } from '@angular/core';
import { Todo } from '../metier/todo';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoServicesService { 
  private todoSubject : BehaviorSubject<Todo[]>;
  private searchTerm: string;
  private typeSearch: string;

  constructor(private http: HttpClient){ 
    this.todoSubject = new BehaviorSubject([]);
    this.searchTerm = "";
    this.typeSearch = "";
  }

  public refreshListe():void{
    //let parametres = new HttpParams();
    //parametres.append(this.typeSearch, this.searchTerm);
    let prm = new URLSearchParams();
    prm.append(this.typeSearch, this.searchTerm);
    let url = "http://localhost:8080/todoList/todos";
    // if (this.searchTerm != "" ){
    //   url += `/search?${this.typeSearch}=${this.searchTerm}`; 
    // }
  
    this.http.get<Todo[]>(url, {params: new HttpParams().set(this.typeSearch, this.searchTerm)}).toPromise().then(todos=>this.todoSubject.next(todos)).catch(err=> console.error(err));
  }

  public listeTodos():Observable<Todo[]>{
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
    this.searchTerm = term;
    this.refreshListe();
  }
}
