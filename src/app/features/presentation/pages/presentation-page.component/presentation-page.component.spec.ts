import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresentationPageComponent } from './presentation-page.component';

describe('PresentationPageComponent', () => {
  let component: PresentationPageComponent;
  let fixture: ComponentFixture<PresentationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
