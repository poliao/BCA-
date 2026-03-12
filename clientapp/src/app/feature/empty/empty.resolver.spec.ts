import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { emptyResolver } from './empty.resolver';

describe('emptyResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => emptyResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
