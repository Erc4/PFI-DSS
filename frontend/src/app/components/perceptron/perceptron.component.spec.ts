import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerceptronComponent } from './perceptron.component';

describe('PerceptronComponent', () => {
  let component: PerceptronComponent;
  let fixture: ComponentFixture<PerceptronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerceptronComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerceptronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
