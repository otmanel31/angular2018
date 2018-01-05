import { TestBed, inject } from '@angular/core/testing';

import { MangaRepositorieService } from './manga-repositorie.service';

describe('MangaRepositorieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MangaRepositorieService]
    });
  });

  it('should be created', inject([MangaRepositorieService], (service: MangaRepositorieService) => {
    expect(service).toBeTruthy();
  }));
});
