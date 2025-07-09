import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaunchIcarePage } from './launch-icare.page';

describe('LaunchIcarePage', () => {
  let component: LaunchIcarePage;
  let fixture: ComponentFixture<LaunchIcarePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchIcarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
