import { TestBed } from '@angular/core/testing';

import { UMSService } from './ums.service';

describe('UMSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UMSService = TestBed.get(UMSService);
    expect(service).toBeTruthy();
  });
});
