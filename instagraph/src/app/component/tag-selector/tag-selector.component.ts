import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { TagRepositoryService } from "../../services/tag-repository.service";
import { Subject } from 'rxjs/Subject';
import { Tag } from '../../metier/tags';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ImageServicesService } from '../../services/image-services.service';
import { log } from 'util';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { AlertManagerService } from '../../services/alert-manager.service';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  // mode 0 => liste/filtrage
  // mode 1 => edition image
  @Input()
  public tagMod: number = 0;

  @Output()
  public tagAddChange : EventEmitter<Tag> = new EventEmitter<Tag>(); // previent le composant parent qun tag est ajouté

  @Output()
  public tagRemoveChange: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Output()
  public tagEventForList: EventEmitter<Tag> = new EventEmitter<Tag>();

  @Input()
  public tagsRelated: Tag[] = [];

  public tagSubject: Subject<Tag[]>; // liste des tags en bas pas besoin de filtre neg ou pos donc pas besoin de tuple
  public tagSubscription: Subscription;

  //public tagsSelected: Observable<Tag[]>; // old
  public tagsSelected: Observable<[boolean, Tag][]>; // ici different de tag subject besoin de tuple 

  public searchTerm:string = "";

  // sujet pour le recherche 
  public searchSubject: Subject<string>;

  public editedTag: Tag;

  modalRef: BsModalRef;

  constructor(private tageRepo: TagRepositoryService, private imgRepo: ImageServicesService,
    private modalService: BsModalService, private alertManager: AlertManagerService
  ) {

  }

  ngOnInit( ) {
    console.log("tag mode= " + this.tagMod);
    this.tagSubject = new Subject<Tag[]>();
    this.searchSubject = new Subject<string>();

    this.tagSubscription = this.tageRepo.listeTagAsObservable()
      .subscribe(page=>{
        this.tagSubject.next(page.content)
      });
    this.tageRepo.refreshListe();
    this.tagsSelected = this.imgRepo.selectedTagsAsObservable();

    this.searchSubject.asObservable()
      .debounceTime(500)
      .subscribe(term=> this.tageRepo.setSearchTerm(term))
    ;
    this.editedTag = new Tag(0, "", "");
  }

  public addToSelectedTag(tag: Tag):void{
    //this.imgRepo.addSelectedTag(tag); OLD
    this.tagAddChange.emit(tag);
  }
  public removeFromSelectedTag(tag: Tag): void{
    //this.imgRepo.removeSelectedTag(tag);
    this.tagRemoveChange.emit(tag);
  }

  public order(tag:Tag):void{
    this.tagEventForList.emit(tag);
  }

  public changeTerm(term: string):void{
    console.log(term);
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  public addTag(createTemplate: TemplateRef<any>):void{
    this.editedTag.libelle = this.searchTerm;
    this.modalRef = this.modalService.show(createTemplate);
  }

  public confirmCreate():void{
    this.modalRef.hide();
    this.tageRepo.create(this.editedTag)
      .then(tag=>{
        this.alertManager.handleSuccessResponse("success", `tag ${tag.libelle} created`);
        this.searchTerm = "";
        this.tageRepo.setSearchTerm(this.searchTerm)
        this.tageRepo.refreshListe();

      })
      .catch(err=> this.alertManager.handleErrorResponse(err));
  }

  public toogleSelectedTag(tag: [boolean, Tag]):void{
    tag[0] = !tag[0];
    this.imgRepo.updateSelectedTag(tag);
  }
}
