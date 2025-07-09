import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IcardPage } from './icard.page';

describe('IcardPage', () => {
  let component: IcardPage;
  let fixture: ComponentFixture<IcardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
