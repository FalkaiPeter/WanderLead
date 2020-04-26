import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGroupComponent } from './price-group.component';

describe('PriceGroupComponent', () => {
  let component: PriceGroupComponent;
  let fixture: ComponentFixture<PriceGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
