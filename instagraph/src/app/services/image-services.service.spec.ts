import { TestBed, inject } from '@angular/core/testing';

import { ImageServicesService } from './image-services.service';

describe('ImageServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageServicesService]
    });
  });

  it('should be created', inject([ImageServicesService], (service: ImageServicesService) => {
    expect(service).toBeTruthy();
  }));
});
