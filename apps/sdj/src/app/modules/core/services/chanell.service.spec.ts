import { TestBed } from '@angular/core/testing';

import { ChanellService } from './chanell.service';

describe('ChanellService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ChanellService = TestBed.get(ChanellService);
        expect(service).toBeTruthy();
    });
});
