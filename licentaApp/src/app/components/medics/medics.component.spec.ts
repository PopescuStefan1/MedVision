import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicsComponent } from './medics.component';

describe('MedicsComponent', () => {
  let component: MedicsComponent;
  let fixture: ComponentFixture<MedicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
