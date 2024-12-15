import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SawCalculatorComponent } from './saw-calculator.component';

describe('SawCalculatorComponent', () => {
  let component: SawCalculatorComponent;
  let fixture: ComponentFixture<SawCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SawCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SawCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
