import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlMatComponent } from './ml-mat.component';

describe('MlMatComponent', () => {
  let component: MlMatComponent;
  let fixture: ComponentFixture<MlMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlMatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
