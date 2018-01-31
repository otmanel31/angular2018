import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
// REACT
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable }      from 'rxjs/Observable';
// CUSTOM
import { Page }        from '../metier/pageable';
import { Image }           from "../metier/image";
import { Tag } from '../metier/tags';
import { promise } from 'selenium-webdriver';


@Injectable()
export class TagRepositoryService {

  private tagSubject: BehaviorSubject<Page<Tag>>;

  private noPage  : number;
  private pageSize: number;

  private basUrlApi:          string = "http://localhost:8080/api/tags";
  private basUrlExtendedApi:  string = "http://localhost:8080/extended_api/tag";

  private searchTerm: string = "";

  constructor(private http: HttpClient) {
    this.noPage = 0;
    this.pageSize = 8;
    this.tagSubject = new BehaviorSubject(Page.emptyPage<Tag>());
  }

  public setSearchTerm(searchTerm:string):void{
    this.searchTerm = searchTerm;
    this.refreshListe();
  }

  refreshListe():void{

    let params: HttpParams = new HttpParams();
    params = params.set('page', ""+this.noPage).set("size", "10"); // ajout du size pou mise ne place de pagination et nn plsu par defaut
    // gestion de la recherche de tag
    if (this.searchTerm != "" && this.searchTerm != null){
      params  = params.set("search", this.searchTerm);
    }
    this.http.get<Page<Tag>>(`${this.basUrlExtendedApi}/liste`, {params: params})
      .toPromise()
      .then(page=>this.tagSubject.next(page))
      .catch(err => console.error(err))
      ;
  }

  public listeTagAsObservable():Observable<Page<Tag>>{
    return this.tagSubject.asObservable();
  }

  public setNoPage(noPage: number):void{
    this.noPage = noPage;
    this.refreshListe();
  }

  public addTags(tags: Tag[], imgs: Image[]):Promise<Tag[]>{
    let contentsIds : string = imgs.map(img=> img.id).join(",");
    let tagIds : string = tags.map(tag=>tag.id).join(",");
    let url = `${this.basUrlExtendedApi}/addTags/${contentsIds}/${tagIds}`;

    return this.http.post<Tag[]>(url,{}).toPromise();
  }

  public create(tag:Tag):Promise<Tag>{
    return this.http.post<Tag>(`${this.basUrlApi}`, tag).toPromise(); 
  }

  public removeTags(tags: Tag[], imgs: Image[]):Promise<Tag[]>{
    let contentsIds : string = imgs.map(img=> img.id).join(",");
    let tagIds : string = tags.map(tag=>tag.id).join(",");
    let url = `${this.basUrlExtendedApi}/removeTags/${contentsIds}/${tagIds}`;

    return this.http.post<Tag[]>(url,{}).toPromise();
  }

  public getRelatedTags(contentId: number):Promise<Tag[]>{
    let url:string = `${this.basUrlExtendedApi}/findRelated/${contentId}`; 
    return this.http.get<Tag[]>(url).toPromise();
  }
}
