import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
// REACT
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable }      from 'rxjs/Observable';
// CUSTOM
import { Page }        from '../metier/pageable';
import { Image }           from "../metier/image";
import { Tag } from '../metier/tags';


@Injectable()
export class TagRepositoryService {

  private tagSubject: BehaviorSubject<Page<Tag>>;

  private noPage  : number;
  private pageSize: number;

  private basUrlApi:          string = "http://localhost:8080/api/tags"
  private basUrlExtendedApi:  string = "http://localhost:8080/extended_api/tag"

  constructor(private http: HttpClient) {
    this.noPage = 0;
    this.pageSize = 8;
    this.tagSubject = new BehaviorSubject(Page.emptyPage<Tag>());
  }

  refreshListe():void{

    let params: HttpParams = new HttpParams();
    params = params.set('page', ""+this.noPage);

    this.http.get<Page<Tag>>(`${this.basUrlExtendedApi}/pliste`, {params: params})
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
}
