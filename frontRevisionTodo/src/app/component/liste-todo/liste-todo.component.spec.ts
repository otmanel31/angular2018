import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTodoComponent } from './liste-todo.component';

describe('ListeTodoComponent', () => {
  let component: ListeTodoComponent;
  let fixture: ComponentFixture<ListeTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
