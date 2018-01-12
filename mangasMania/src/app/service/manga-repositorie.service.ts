import { Injectable } from '@angular/core';
import { Manga } from '../metier/mangas';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Pageable } from '../metier/pageable';

@Injectable()
export class MangaRepositorieService {

  private basUrl: string = "http://localhost:8080/mangasMania"
  private baseExtendedUrl: string = "http://localhost:8080/extended_api"
  private mangasSubject: BehaviorSubject<Pageable<Manga>>;
  private searchTerm: string; // recherche sur le titre

  private noPage:number;

  private filterByRatingMin: number;

  private idMangas4Upload: number;

  constructor(private _http: HttpClient) {
    // this.mangas = [new Manga(1,"angular contre attaque", "linus", new Date(), "aventure", 4),
    //     new Manga(2,"la chute de jsf", "carmack", new Date(), "horreur", 1),
    //     new Manga(3,"casablance 2", "ali baba", new Date(), "comedie", 5),
    //     new Manga(4,"coboliste le survivant", "bill", new Date(), "histoire", 4)];
    this.mangasSubject = new BehaviorSubject(new Pageable([], 0,0,5,0,1,true, false, null));
    this.searchTerm = "";
    this.noPage = 0; // par défaut au lancement
    this.filterByRatingMin = 0;
  }

  public setFilterByRatingMin(rating: number):void{
    this.filterByRatingMin = rating;
    this.refreshListe();
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
    let url = `${this.baseExtendedUrl}/pmangas`;
    if (this.searchTerm != "" ){
      url += `/search/${this.searchTerm}`; 
    }

    // attention urlparams tuple type immuable
    // cet objet permet de déleguer a angular la construction de l url apres le  ? autrmeent dit la gestion des query paramters
    let params: HttpParams = new HttpParams();
    //console.log(this.noPage)
    params = params.set("page",  this.noPage.toString());
    console.log(params)
    if (this.filterByRatingMin > 0){
      params = params.set('ratingMin',''+ this.filterByRatingMin);
    }
    //url += `?page=${this.noPage}`;
    this._http.get<Pageable<Manga>>(url, {params: params})
      .toPromise()
      .then(mangas => this.mangasSubject.next(mangas));
  }

  public listeMangas(): Observable<Pageable<Manga>>{
    return this.mangasSubject.asObservable();
    //freturn this.mangasSubject.asObservable();
  }

  public findById(id: number): Promise<Manga>{
    let url = `${this.baseExtendedUrl}/mangas/${id}`;
    return this._http.get<Manga>(url).toPromise();
  }
  public save(m: Manga):Promise<Manga>{
    let url = `${this.baseExtendedUrl}/mangas`;
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
    let url = `${this.baseExtendedUrl}/mangas/${id}`;
    return this._http.delete<Manga>(url).toPromise();
  }

  getImgThumbUrl(id:number):string{
    return `${this.baseExtendedUrl}/downloadThumb/${id}`;
  }
  public getImgUrl(id:number):string{
    return `${this.baseExtendedUrl}/download/${id}`;
  }
  public getUploadUrl():string{
    return `${this.baseExtendedUrl}/image/upload/${this.idMangas4Upload}`;
  }

  public setIdManga4Upload(id: number):void{
    this.idMangas4Upload = id;
  }
}
