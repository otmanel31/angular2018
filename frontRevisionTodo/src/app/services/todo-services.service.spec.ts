import { TestBed, inject } from '@angular/core/testing';

import { TodoServicesService } from './todo-services.service';

describe('TodoServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoServicesService]
    });
  });

  it('should be created', inject([TodoServicesService], (service: TodoServicesService) => {
    expect(service).toBeTruthy();
  }));
});
