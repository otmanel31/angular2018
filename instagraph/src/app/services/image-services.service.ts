// ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
// REACT
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable }      from 'rxjs/Observable';
// CUSTOM
import { Page }        from '../metier/pageable';
import { Image }           from "../metier/image";


@Injectable()
export class ImageServicesService {

  private imgSubject: BehaviorSubject<Page<Image>>;

  private noPage  : number;
  private pageSize: number;

  private basUrlApi:          string = "http://localhost:8080/api/images"
  private basUrlExtendedApi:  string = "http://localhost:8080/extended_api/images"

  constructor(private http: HttpClient) {
    this.noPage = 0;
    this.pageSize = 12;
    this.imgSubject = new BehaviorSubject(Page.emptyPage<Image>());

  }

  refreshListe():void{

    let params: HttpParams = new HttpParams();
    params = params.set('page', ""+this.noPage);

    this.http.get<Page<Image>>(`${this.basUrlExtendedApi}/plistesByTags`, {params: params})
      .toPromise()
      .then(page=>this.imgSubject.next(page));
  }

  public listeImgAsObservable():Observable<Page<Image>>{
    return this.imgSubject.asObservable();
  }

  public getImgThumbUrl(id:number):string{
    return `${this.basUrlExtendedApi}/downloadThumb/${id}`;
  }

  public getImgUrl(id:number):string{
    return `${this.basUrlExtendedApi}/download/${id}`;
  }

  public getUploadUrl():string{
    return `${this.basUrlExtendedApi}/upload`;
  }

  public setNoPage(noPage: number):void{
    this.noPage = noPage;
    this.refreshListe();
  }

  //public delete(ids:number[]):Promise<Map<string, number>>{
  public delete(ids:number[]):void{
    let id: string = ids.join(",");
    let urlParams = new HttpParams()
    urlParams = urlParams.set('imgsId', id);

    this.http.delete(`${this.basUrlExtendedApi}/delete`, {params:urlParams})
      .toPromise()
      .then(result=> this.refreshListe())
      .catch(err=> console.error(err));
  }
}
