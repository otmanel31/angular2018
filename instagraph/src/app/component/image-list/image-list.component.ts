import { Component, OnInit, OnDestroy, TemplateRef  } from '@angular/core';
import { ImageServicesService } from '../../services/image-services.service';

import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Image } from '../../metier/image';

// bs modal service reference du de la modal que lon a ouvert
// modal service permet de genener ds nouvelle modales
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Lightbox } from 'angular2-lightbox/lightbox.service';

import { TruncatePipe } from 'angular-pipes/src/string/truncate.pipe';
import { BytesPipe } from 'angular-pipes/src/math/bytes.pipe';
import { AuthManagerService } from '../../services/auth-manager.service';
import { AlertManagerService } from '../../services/alert-manager.service';
import { Tag } from '../../metier/tags';
import { IAlbum } from 'angular2-lightbox';
import { link } from 'fs';
import { TagRepositoryService } from '../../services/tag-repository.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private imgs: Subject<Image[]>;

  totalItems: number = 0;
  currentPage:number = 1;

  modalRef: BsModalRef;

  public idToDelete: number;

  public galleryLinks: any[];

  public selectedImg: Image[];
  public isDeleteAll: boolean = false;

  public selectedImgAllCurrentPage: Image[];

  public tag4PopUp: Tag;
  
  constructor(private imgRepo: ImageServicesService, private tagRepo:  TagRepositoryService,
    private modalService: BsModalService, private lightBox: Lightbox, 
    private authManager: AuthManagerService, private alertManager: AlertManagerService) {
  }

  ngOnInit() {
    this.imgs = new Subject();
    this.selectedImgAllCurrentPage = [];
    this.subscription = this.imgRepo.listeImgAsObservable()
      .subscribe(p=>{
        // mettre a jours les liens pour lightbox 
        this.galleryLinks = [];
        this.selectedImgAllCurrentPage = p.content;
        p.content.forEach(img=>{
          //this.selectedImgAllCurrentPage.push(img);
          this.galleryLinks.push({
            id: img.id,
            src: this.getImgUrl(img.id),
            caption: img.fileName
          });
        });
        // publier les imgs pour le ngFor
        this.imgs.next(p.content)
        this.totalItems = p.totalElements;
        this.currentPage = p.number + 1;
      })/*, err=>{ plus besoin gerer ds le service
        this.alertManager.handleErrorResponse(err);
      });*/ // possiblite de .catch derriere si on lajoute via rxjs
    this.imgRepo.refreshListe();
    this.selectedImg = [];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getImgThumbUrl(id:number):string{
    return this.imgRepo.getImgThumbUrl(id);
  }

  public getImgUrl(id:number):string{
    return this.imgRepo.getImgUrl(id);
  }

  pageChanged(evt):void{
    this.imgRepo.setNoPage(evt.page - 1);
  }

  public delete(id:number, deleteTemplate: TemplateRef<any>):void{
    console.log(id);
    this.idToDelete = id;
    this.modalRef = this.modalService.show(deleteTemplate);
  }

  
  public canDelete():boolean{
    return true;
    //return this.authManager.isRoleActive("ROLE_ADMIN") || this.authManager.isRoleActive("ROLE_USER");
  }

  public confirmDelete():void{
    if (this.isDeleteAll) this.imgRepo.delete(this.selectedImg.map(img=>img.id));
    else{
      this.imgRepo.delete([this.idToDelete]);
    }
    this.isDeleteAll = false;
    this.modalRef.hide();
  }
  cancelDelete(){
    this.modalRef.hide();
  }
  openGallery(img: Image):void{
    //let album = [];
    // album.push({
    //   src: this.imgRepo.getImgUrl(img.id),
    //   caption:img.fileName
    // })

    // ===> https://github.com/themyth92/angular2-lightbox
    let position = this.galleryLinks.findIndex(imgLink=> imgLink.id==img.id);
    this.lightBox.open(this.galleryLinks, position, {fadeDuration: 0.3, resizeDuration:0.3, showImageNumberLabel:true});
  }

  public getImagePopOvertext(image: Image):string{
    if (image.tags == null || image.tags.length == 0){
      return "aucun tags";
    }
    else {
      return "tags: " + image.tags.map(t => t.libelle).join(',');
    }
  }

  public selectedNewTag(tag: Tag):void{
    // ici on dit o repo d'ajout un filtre
    this.imgRepo.addSelectedTag(tag);
  }

  public unSelectedTag(tag: Tag):void{
    this.imgRepo.removeSelectedTag(tag);
  }

  public isSelected(img: Image):boolean{
    return this.selectedImg.findIndex(i=> i.id == img.id) != -1;
  }

  public toogleSelect(img:Image):void{
    let index = this.selectedImg.findIndex(i=> i.id == img.id)
    if (index == -1) this.selectedImg.push(img);
    else this.selectedImg.splice(index,1);
  }

  public openSelectedGallery():void{
    let links = [];
    this.selectedImg.forEach(img=>{
      links.push({id:img.id, src:this.imgRepo.getImgUrl(img.id), caption:img.fileName})
    } )
    this.lightBox.open( links, 0, {fadeDuration: 0.3, resizeDuration:0.3, showImageNumberLabel:true});
  }

  public reset():void{
    this.selectedImg = [];
  }

  public deleteSelected( deleteTemplate: TemplateRef<any>):void{
    this.isDeleteAll = true;
    this.modalRef = this.modalService.show(deleteTemplate);
    /*this.imgRepo.delete(this.selectedImg.map(img => img.id));
    this.modalRef.hide();*/
  }

  public selectAll():void{
    console.log('in select all')
    // this.selectedImg = [];    this.selectedImg = this.selectedImgAllCurrentPage;
    this.selectedImgAllCurrentPage.forEach(img=>{
      if (this.selectedImg.findIndex(i=> i.id == img.id) != -1) return;
      else this.selectedImg.push(img);
    })

  }

  public addTagToSelected():void{
    this.tagRepo.addTags([this.tag4PopUp], this.selectedImg)
      .then(resp => {
        this.imgRepo.refreshListe();
        this.alertManager.handleSuccessResponse("success", "tag succesfully added")
      })
      .catch(err=> this.alertManager.handleErrorResponse(err)); 
    this.modalRef.hide();
  }

  public removeTagToSelected():void{
    this.tagRepo.removeTags([this.tag4PopUp], this.selectedImg)
      .then(resp => {
        this.imgRepo.refreshListe();
        this.alertManager.handleSuccessResponse("success", "tag succesfully deleted")
      })
      .catch(err=> this.alertManager.handleErrorResponse(err));
    this.modalRef.hide();
  }
  public addRemovTag(tag:Tag, addRemoveTemplate: TemplateRef<any>):void{
    this.tag4PopUp = tag;
    this.modalRef = this.modalService.show(addRemoveTemplate);
  }
}
