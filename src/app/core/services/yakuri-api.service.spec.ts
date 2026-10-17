import { TestBed } from '@angular/core/testing';
import { YakuriApiService } from './yakuri-api.service';

describe('YakuriApiService', () => {
  let service: YakuriApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YakuriApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
