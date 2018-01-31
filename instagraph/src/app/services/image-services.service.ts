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

  private selectedTags: [boolean,Tag][]; // mise ne place dun tuple au lieu d'une simple liste comme avant
  private selectedTagsSubject: BehaviorSubject<[boolean,Tag][]>;

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
    if (this.selectedTags.findIndex(t => t[1].id == tag.id) == -1){
      // si tag nn presenet on peux lajouter
      this.selectedTags.push([true, tag]);
      // je previens que la liste des tags selecgtionnne a été changer !! 
      this.selectedTagsSubject.next(this.selectedTags);
      this.refreshListe();
    }
  }

  public removeSelectedTag(tag: Tag){
    let index =  (this.selectedTags.findIndex(t=>t[1].id == tag.id));
    if (index != -1) {
      this.selectedTags.splice(index, 1);
      this.selectedTagsSubject.next(this.selectedTags);
      this.refreshListe();
    }
  }

  // permet de modifier le  flag included excluded dun tag deja selectionner
  public updateSelectedTag(tag: [boolean,Tag]){
    let index =  (this.selectedTags.findIndex(t=>t[1].id == tag[1].id));
    if (index != -1) {
      this.selectedTags[index][0] = tag[0]
      this.selectedTagsSubject.next(this.selectedTags);
      this.refreshListe();
    }
  }

  public selectedTagsAsObservable(): Observable<[boolean, Tag][]>{
    return this.selectedTagsSubject.asObservable();
  }

  refreshListe():void{

    let params: HttpParams = new HttpParams();
    params = params.set('page', ""+this.noPage);
    let positiveTags = this.selectedTags.filter(t=>t[0]); //true
    let negativeTags = this.selectedTags.filter(t=> !t[0]); // not true
    /*if (this.selectedTags.length>0){   OLD
      params = params.set("tagsId", this.selectedTags.map(tag=> ""+tag.id).join(',')); OLD // liste des ids de tag seperé par des virgule
    }*/
    if (positiveTags.length>0){ 
      params = params.set("tagsId", positiveTags.map(tag=> ""+tag[1].id).join(',')); // liste des ids de tag seperé par des virgule
    }
    if (negativeTags.length>0){ 
      params = params.set("negativeTagsId", negativeTags.map(tag=> ""+tag[1].id).join(',')); // liste des ids de tag seperé par des virgule
    }
    this.http.get<Page<Image>>(`${this.basUrlExtendedApi}/findbytagfull`, {params: params})
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
    return `${this.basUrlExtendedApi}/downloadthumb/${id}`;
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

  public findImage(id:number):Promise<Image>{
    let url = `${this.basUrlExtendedApi}/findone/${id}`;
    return this.http.get<Image>(url).toPromise();
  }
  
  public updateImage(image:Image):Promise<Image>{
    let url = `${this.basUrlExtendedApi}/updateone/${image.id}`;
    let urlParams = new HttpParams();
    urlParams = urlParams.set("name",image.name);
    urlParams = urlParams.set("description",image.description);
    urlParams = urlParams.set("fileName",image.fileName);
    return this.http.put<Image>(url, {}, {params:urlParams}).toPromise();
  }

}
