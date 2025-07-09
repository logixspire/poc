import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NurseDashboardPage } from './nurse-dashboard.page';

describe('NurseDashboardPage', () => {
  let component: NurseDashboardPage;
  let fixture: ComponentFixture<NurseDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
