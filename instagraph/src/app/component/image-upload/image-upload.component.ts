import { Component, OnInit } from '@angular/core';
import { FileUploader } from "ng2-file-upload";
import { ImageServicesService } from '../../services/image-services.service';
import { AuthManagerService } from '../../services/auth-manager.service';
import { Tag } from '../../metier/tags';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;

  public tagRelated: Tag[] = [];

  constructor(private imgRepo: ImageServicesService, private authManager: AuthManagerService){
    this.uploader = new FileUploader({
      autoUpload: true,
      url: this.imgRepo.getUploadUrl(),
      /*authTokenHeader: "Authorization",
      authToken:`Basic ${this.authManager.getCredentials()}`*/
    });
  }

  ngOnInit() {
  }
  public fileOverDrop(evt):void{
    this.hasBaseDropZoneOver = evt;
  }

  public selectedNewTag(tag: Tag):void{
    let pos = this.tagRelated.findIndex(t => t.id == tag.id);
    if (pos == -1 ) this.tagRelated.push(tag);
    let idsString = this.tagRelated.map(tag=> tag.id).join(',');
    console.log(idsString)
    this.uploader.setOptions({ url: this.imgRepo.getUploadUrl()+"?idsTagString="+idsString});
  }

  public unSelectedTag(tag: Tag):void{
    let pos = this.tagRelated.findIndex(t=> t.id == tag.id);
    if (pos != -1) this.tagRelated.splice(pos, 1);
    let idsString = "";
    if (this.tagRelated.length != 0){
      idsString = this.tagRelated.map(tag => tag.id).join(',');
      this.uploader.setOptions({url: this.imgRepo.getUploadUrl()+"?idsTagString="+idsString});
    }
    else this.uploader.setOptions({url: this.imgRepo.getUploadUrl()});
    
  }
}
