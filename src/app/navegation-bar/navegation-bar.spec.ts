import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavegationBar } from './navegation-bar';

describe('NavegationBar', () => {
  let component: NavegationBar;
  let fixture: ComponentFixture<NavegationBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegationBar],
    }).compileComponents();

    fixture = TestBed.createComponent(NavegationBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
