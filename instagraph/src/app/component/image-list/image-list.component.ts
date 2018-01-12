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

  constructor(private imgRepo: ImageServicesService, 
    private modalService: BsModalService, private lightBox: Lightbox) {

  }

  ngOnInit() {
    this.imgs = new Subject();
    this.subscription = this.imgRepo.listeImgAsObservable()
      .subscribe(p=>{
        // mettre a jours les liens pour lightbox 
        this.galleryLinks = [];
        p.content.forEach(img=>{
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
      });
    this.imgRepo.refreshListe();
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

  public confirmDelete():void{
    this.imgRepo.delete([this.idToDelete]);
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
}
