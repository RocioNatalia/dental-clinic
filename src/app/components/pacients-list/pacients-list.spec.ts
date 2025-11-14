import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsList } from './pacients-list';

describe('PacientsList', () => {
  let component: PacientsList;
  let fixture: ComponentFixture<PacientsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
