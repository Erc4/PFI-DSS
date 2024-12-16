import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplexCalculatorComponent } from './simplex-calculator.component';

describe('SimplexCalculatorComponent', () => {
  let component: SimplexCalculatorComponent;
  let fixture: ComponentFixture<SimplexCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimplexCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplexCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
