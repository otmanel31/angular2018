import { Component, OnInit } from '@angular/core';
import { FileUploader } from "ng2-file-upload";
import { ImageServicesService } from '../../services/image-services.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;

  constructor(private imgRepo: ImageServicesService){
    this.uploader = new FileUploader({
      autoUpload: true,
      url: this.imgRepo.getUploadUrl()
    });
  }

  ngOnInit() {
  }
  public fileOverDrop(evt):void{
    this.hasBaseDropZoneOver = evt;
  }
}
