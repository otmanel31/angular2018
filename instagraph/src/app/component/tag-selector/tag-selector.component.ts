import { Component, OnInit } from '@angular/core';
import { TagRepositoryService } from "../../services/tag-repository.service";
import { Subject } from 'rxjs/Subject';
import { Tag } from '../../metier/tags';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  public tagSubject: Subject<Tag[]>;
  public tagSubscription: Subscription;

  constructor(private tageRepo: TagRepositoryService) {

  }

  ngOnInit( ) {
    this.tagSubject = new Subject<Tag[]>();
    this.tagSubscription = this.tageRepo.listeTagAsObservable()
      .subscribe(page=>{
        this.tagSubject.next(page.content)
      });
    this.tageRepo.refreshListe()
  }

}
