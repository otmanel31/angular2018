import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Todo } from '../../metier/todo';
import { TodoServicesService } from '../../services/todo-services.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-liste-todo',
  templateUrl: './liste-todo.component.html',
  styleUrls: ['./liste-todo.component.css']
})
export class ListeTodoComponent implements OnInit {

  public todos: Observable<Todo[]>
  public searchTerm: string;
  public typeSearch: string;
  private searchRalentisseur: Subject<[string, string]>;

  constructor(private todoRepo: TodoServicesService){ 
    this.searchRalentisseur = new Subject();
  }

  ngOnInit() {
    this.todos = this.todoRepo.listeTodos();
    this.todoRepo.refreshListe();
    this.searchRalentisseur
      .debounceTime(1500)
      .subscribe(newTerm=>{
        this.todoRepo.changeSearch(newTerm[0], newTerm[1]);
      })

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
}
