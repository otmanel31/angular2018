import { Component, OnInit } from '@angular/core';
import { TagRepositoryService } from "../../services/tag-repository.service";
import { Subject } from 'rxjs/Subject';
import { Tag } from '../../metier/tags';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ImageServicesService } from '../../services/image-services.service';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  public tagSubject: Subject<Tag[]>;
  public tagSubscription: Subscription;

  public tagsSelected: Observable<Tag[]>;

  constructor(private tageRepo: TagRepositoryService, private imgRepo: ImageServicesService) {

  }

  ngOnInit( ) {
    this.tagSubject = new Subject<Tag[]>();
    this.tagSubscription = this.tageRepo.listeTagAsObservable()
      .subscribe(page=>{
        this.tagSubject.next(page.content)
      });
    this.tageRepo.refreshListe();
    this.tagsSelected = this.imgRepo.selectedTagsAsObservable();
  }

  public addToSelectedTag(tag: Tag):void{
    this.imgRepo.addSelectedTag(tag);
  }
  public removeFromSelectedTag(tag: Tag): void{
    this.imgRepo.removeSelectedTag(tag);
  }
}
