import { TestBed } from '@angular/core/testing';
import { LocalEthicsFallbackService } from './local-ethics-fallback.service';

describe('LocalEthicsFallbackService', () => {
  let service: LocalEthicsFallbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalEthicsFallbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
