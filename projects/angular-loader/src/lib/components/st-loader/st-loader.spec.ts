import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StLoader } from './st-loader';

describe('StLoader', () => {
  let component: StLoader;
  let fixture: ComponentFixture<StLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(StLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
