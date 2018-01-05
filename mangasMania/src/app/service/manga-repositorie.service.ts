import { Injectable } from '@angular/core';
import { Manga } from '../metier/mangas';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class MangaRepositorieService {

  private mangasSubject: BehaviorSubject<Manga[]>;
  private searchTerm: string; // recherche sur le titre

  constructor(private _http: HttpClient) {
    // this.mangas = [new Manga(1,"angular contre attaque", "linus", new Date(), "aventure", 4),
    //     new Manga(2,"la chute de jsf", "carmack", new Date(), "horreur", 1),
    //     new Manga(3,"casablance 2", "ali baba", new Date(), "comedie", 5),
    //     new Manga(4,"coboliste le survivant", "bill", new Date(), "histoire", 4)];
    this.mangasSubject = new BehaviorSubject([]);
    this.searchTerm = "";
  }

  // meth appele si un composant veux modifer la liste des mangas
  public changeSearch(elt:string):void{
    this.searchTerm = elt;
    // on rafraichit la liste
    this.refreshListe();
  }

  public refreshListe():void{
    // quand on veut refresh la liste , 
    let url = "http://localhost:8080/mangasMania/mangas";
    if (this.searchTerm != "" ){
      url += `/search/${this.searchTerm}`; 
    }
    this._http.get<Manga[]>(url)
      .toPromise()
      .then(mangas => this.mangasSubject.next(mangas));
  }

  public listeMangas(): Observable<Manga[]>{
    return this.mangasSubject.asObservable();
    //freturn this.mangasSubject.asObservable();
  }

  public findById(id: number): Promise<Manga>{
    let url = `http://localhost:8080/mangasMania/mangas/${id}`;
    return this._http.get<Manga>(url).toPromise();
  }
  public save(m: Manga):Promise<Manga>{
    let url = "http://localhost:8080/mangasMania/mangas";
    let option ={
      headers: new HttpHeaders({"Content-Type":"application/json"})
    }
    if (m.id == 0){
      //insert
      return this._http.post<Manga>(url, m, option).toPromise();
    }else{
      // update
      return this._http.put<Manga>(url, m, option).toPromise();
    }
  }

  public delete(id: number): Promise<Manga>{
    let url = `http://localhost:8080/mangasMania/mangas/${id}`;
    return this._http.delete<Manga>(url).toPromise();
  }

}
