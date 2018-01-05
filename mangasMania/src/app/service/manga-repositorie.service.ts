import { Injectable } from '@angular/core';
import { Manga } from '../metier/mangas';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Pageable } from '../metier/pageable';

@Injectable()
export class MangaRepositorieService {

  private mangasSubject: BehaviorSubject<Pageable<Manga>>;
  private searchTerm: string; // recherche sur le titre

  private noPage:number;

  constructor(private _http: HttpClient) {
    // this.mangas = [new Manga(1,"angular contre attaque", "linus", new Date(), "aventure", 4),
    //     new Manga(2,"la chute de jsf", "carmack", new Date(), "horreur", 1),
    //     new Manga(3,"casablance 2", "ali baba", new Date(), "comedie", 5),
    //     new Manga(4,"coboliste le survivant", "bill", new Date(), "histoire", 4)];
    this.mangasSubject = new BehaviorSubject(new Pageable([], 0,0,5,0,1,true, false, null));
    this.searchTerm = "";
    this.noPage = 0; // par défaut au lancement
  }

  setNoPage(no:number):void{
    this.noPage = no;
    this.refreshListe();
  }
  // meth appele si un composant veux modifer la liste des mangas
  public changeSearch(elt:string):void{
    this.searchTerm = elt;
    // on rafraichit la liste
    this.refreshListe();
  }

  public refreshListe():void{
    // quand on veut refresh la liste , 
    let url = "http://localhost:8080/mangasMania/pmangas";
    if (this.searchTerm != "" ){
      url += `/search/${this.searchTerm}`; 
    }
    url += `?page=${this.noPage}`;
    this._http.get<Pageable<Manga>>(url)
      .toPromise()
      .then(mangas => this.mangasSubject.next(mangas));
  }

  public listeMangas(): Observable<Pageable<Manga>>{
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
