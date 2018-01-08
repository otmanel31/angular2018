import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Todo } from '../../metier/todo';
import { TodoServicesService } from '../../services/todo-services.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-liste-todo',
  templateUrl: './liste-todo.component.html',
  styleUrls: ['./liste-todo.component.css']
})
export class ListeTodoComponent implements OnInit, OnDestroy {
  
  public todos: Subject<Todo[]>
  public searchTerm: string;
  public typeSearch: string;
  //public searchDouble: string;
  private searchRalentisseur: Subject<[string, string]>;

  public todosSubscription: Subscription;

  public totalItems: number;
  public currentPage: number;

  constructor(private todoRepo: TodoServicesService){ 
    this.searchRalentisseur = new Subject();
  }

  ngOnInit() {
    this.todos = new Subject();
    this.todoRepo.refreshListe();
    this.searchRalentisseur
      .debounceTime(1500)
      .subscribe(newTerm=>{
        this.todoRepo.changeSearch(newTerm[0], newTerm[1]);
      })
    this.todosSubscription = this.todoRepo.listeTodos().subscribe(page=>{
      this.totalItems = page.totalElements;
      this.currentPage = page.number + 1;
      this.todos.next(page.content);
    })
    this.todoRepo.refreshListe();
  }

  ngOnDestroy(): void {
    this.todosSubscription.unsubscribe();
  }

  deleteTodo(id: number):void{
    this.todoRepo.delete(id)
      .then(todo=>{
        console.log('todo delete => ' + todo.id);
        this.todoRepo.refreshListe();
      })
      .catch(err => console.error(err));
  }

  search(evt, text):void{
    if (evt != undefined || evt != ""){
      // debut recherhce par filter
      this.searchRalentisseur.next([evt, text]);

    }
  }

  pageChanged(event){
    console.log(event);
    this.todoRepo.setNoPage(event.page - 1); // - 1 pour le serveur
  }
}
