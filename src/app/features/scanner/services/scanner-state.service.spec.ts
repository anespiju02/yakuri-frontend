import { TestBed } from '@angular/core/testing';
import { ScannerStateService } from './scanner-state.service';

describe('ScannerStateService', () => {
  let service: ScannerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScannerStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
