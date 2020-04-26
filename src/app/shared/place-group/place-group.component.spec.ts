import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceGroupComponent } from './place-group.component';

describe('PlaceGroupComponent', () => {
  let component: PlaceGroupComponent;
  let fixture: ComponentFixture<PlaceGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
