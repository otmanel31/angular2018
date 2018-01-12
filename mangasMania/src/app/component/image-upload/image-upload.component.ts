import { Component, OnInit } from '@angular/core';
import { FileUploader } from "ng2-file-upload";
import { MangaRepositorieService } from '../../service/manga-repositorie.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  public uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  private mangaId: number;

  constructor(private mangaRepo: MangaRepositorieService) {
    this.uploader = new FileUploader({
      autoUpload:true,
      url: this.mangaRepo.getUploadUrl()
    });
  }

  ngOnInit() {
  }
  
  public fileOverDrop(evt):void{
    this.hasBaseDropZoneOver = evt;
  }
}
