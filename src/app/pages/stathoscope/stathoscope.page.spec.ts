import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StathoscopePage } from './stathoscope.page';

describe('StathoscopePage', () => {
  let component: StathoscopePage;
  let fixture: ComponentFixture<StathoscopePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StathoscopePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
