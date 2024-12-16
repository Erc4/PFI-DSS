import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataminingComponent } from './datamining.component';

describe('DataminingComponent', () => {
  let component: DataminingComponent;
  let fixture: ComponentFixture<DataminingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataminingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataminingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
