import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAppointmentPage } from './add-appointment.page';

describe('AddAppointmentPage', () => {
  let component: AddAppointmentPage;
  let fixture: ComponentFixture<AddAppointmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
