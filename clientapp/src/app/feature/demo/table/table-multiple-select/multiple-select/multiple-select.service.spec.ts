import { TestBed } from '@angular/core/testing';
import { MultipleSelectService } from './multiple-select.service';


describe('MultipleSelectService', () => {
  let service: MultipleSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
