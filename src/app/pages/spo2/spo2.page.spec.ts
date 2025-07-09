import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spo2Page } from './spo2.page';

describe('Spo2Page', () => {
  let component: Spo2Page;
  let fixture: ComponentFixture<Spo2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Spo2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
