import { Component, OnInit } from '@angular/core';
import { ImageServicesService } from '../../services/image-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Image } from '../../metier/image';
import { AlertManagerService } from '../../services/alert-manager.service';
import { Tag } from '../../metier/tags';
import { TagRepositoryService } from '../../services/tag-repository.service';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements OnInit {

  public editedImg: any|Image; // peut combiner plusieurs type

  public tagRelated: Tag[] = [];

  constructor(private imageRepo: ImageServicesService, private router:Router, private tagRepo: TagRepositoryService,
          private activeRoute: ActivatedRoute, private alertManager:AlertManagerService
  ) {

  }

  ngOnInit() {
    this.editedImg = {};
    this.activeRoute.params.subscribe(params=>{
      let id = params['id'];
      console.log("id image in init component image edit => " + id);
      this.imageRepo.findImage(id)
      .then(img=> {
        this.editedImg = img
        this.refreshTags()
      })
      .catch(err => {
          console.error(err);
          this.alertManager.handleErrorResponse(err);
          this.router.navigateByUrl('/liste');
        })
    })
  }

  saveImage():void{
    this.imageRepo.updateImage(this.editedImg).then(img=> {
      this.alertManager.handleSuccessResponse("success", `image '${img.name}' saved`)
      this.router.navigateByUrl('/liste')
    })
      .catch(err=>{
        console.error(err);
        this.alertManager.handleErrorResponse(err);
      })
  }
  public selectedNewTag(tag: Tag):void{
    // ajout tag a img
    console.log("in selected new tag meth")
    this.tagRepo.addTags([tag], [this.editedImg])
      .then(tags => {
        this.refreshTags()
        this.alertManager.handleSuccessResponse("succes", `tag '${tags[0].libelle}' correctement ajouté`) 
      })
      .catch(err => this.alertManager.handleErrorResponse( err));
  }

  public unSelectedTag(tag: Tag):void{
    //retrait retrait  img
    this.tagRepo.removeTags([tag], [this.editedImg])
      .then(tags=>{
        this.refreshTags()
        this.alertManager.handleSuccessResponse("succes", `tag '${tags[0].libelle}' correctement retiré`) 
      })
      .catch(err => this.alertManager.handleErrorResponse( err));
    ;
  }

  public refreshTags():void{
    this.tagRepo.getRelatedTags(this.editedImg.id)
      .then(tags=>{
        this.tagRelated=tags;
      })
      .catch(err=>this.alertManager.handleErrorResponse(err))
    ;
  }

  public getImgThumbUrl():string{
    return this.imageRepo.getImgThumbUrl(this.editedImg.id);
  }
}
