import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageServicesService } from '../../services/image-services.service';

import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Image } from '../../metier/image';

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

  constructor(private imgRepo: ImageServicesService) {

  }

  ngOnInit() {
    this.imgs = new Subject();
    this.subscription = this.imgRepo.listeImgAsObservable()
      .subscribe(p=>{
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
}
