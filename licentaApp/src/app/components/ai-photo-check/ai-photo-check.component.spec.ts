import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIPhotoCheckComponent } from './ai-photo-check.component';

describe('AIPhotoCheckComponent', () => {
  let component: AIPhotoCheckComponent;
  let fixture: ComponentFixture<AIPhotoCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AIPhotoCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIPhotoCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
