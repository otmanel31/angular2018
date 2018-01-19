// ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
// REACT
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable }      from 'rxjs/Observable';
// CUSTOM
import { Page }        from '../metier/pageable';
import { Image }           from "../metier/image";
import { Tag } from '../metier/tags';
import { Subject } from 'rxjs/Subject';
import { AlertManagerService } from './alert-manager.service';


@Injectable()
export class ImageServicesService {

  private imgSubject: BehaviorSubject<Page<Image>>;

  private noPage  : number;
  private pageSize: number;

  private basUrlApi:          string = "http://localhost:8080/api/images"
  private basUrlExtendedApi:  string = "http://localhost:8080/extended_api/images"

  private selectedTags: Tag[];
  private selectedTagsSubject: BehaviorSubject<Tag[]>;

  constructor(private http: HttpClient, private alertManager: AlertManagerService) {
    // init imgs
    this.noPage = 0;
    this.pageSize = 12;
    this.imgSubject = new BehaviorSubject(Page.emptyPage<Image>());
    // init tags
    this.selectedTags = [];
    this.selectedTagsSubject = new BehaviorSubject(this.selectedTags);
  }

  public addSelectedTag(tag: Tag){
    if (this.selectedTags.findIndex(t => t.id == tag.id) == -1){
      // si tag nn presenet on peux lajouter
      this.selectedTags.push(tag);
      // je previens que la liste des tags selecgtionnne a été changer !! 
      this.selectedTagsSubject.next(this.selectedTags);
      this.refreshListe();
    }
  }

  public removeSelectedTag(tag: Tag){
    let index =  (this.selectedTags.findIndex(t=>t.id == tag.id));
    if (index != -1) {
      this.selectedTags.splice(index, 1);
      this.selectedTagsSubject.next(this.selectedTags);
      this.refreshListe();
    }
  }

  public selectedTagsAsObservable(): Observable<Tag[]>{
    return this.selectedTagsSubject.asObservable();
  }

  refreshListe():void{

    let params: HttpParams = new HttpParams();
    params = params.set('page', ""+this.noPage);

    if (this.selectedTags.length>0){
      params = params.set("tagsId", this.selectedTags.map(tag=> ""+tag.id).join(',')); // liste des ids de tag seperé par des virgule
    }
    this.http.get<Page<Image>>(`${this.basUrlExtendedApi}/plistesByTagsFull`, {params: params})
      .toPromise()
      .then(page=>this.imgSubject.next(page))
      /*.catch(err => {

        console.log("error => in image service ... ")
        console.error(err)
      })*/
      .catch(err => {
        this.alertManager.handleErrorResponse(err);
      })
      ;
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
      .then(result=> {
        this.alertManager.handleSuccessResponse("success", "image succesfulyy deleted");
        this.refreshListe();
      }, err=>{
        this.alertManager.handleErrorResponse(err); // varuiante de catch
      })
      //.catch(err=> console.error(err));
  }

  

}
