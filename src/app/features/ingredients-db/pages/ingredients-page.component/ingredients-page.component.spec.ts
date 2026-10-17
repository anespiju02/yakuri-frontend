import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsPageComponent } from './ingredients-page.component';

describe('IngredientsPageComponent', () => {
  let component: IngredientsPageComponent;
  let fixture: ComponentFixture<IngredientsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
