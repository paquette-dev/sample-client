import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        MatCardModule,
        MatButtonModule,
        RouterTestingModule,
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation', () => {
    it('should navigate to the specified path', () => {
      const navigateSpy = spyOn(router, 'navigate');
      const testPath = '/users';

      component.navigateTo(testPath);

      expect(navigateSpy).toHaveBeenCalledWith([testPath]);
    });
  });

  it('should display the welcome message', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to Sample App'
    );
  });

  it('should have a card with user management information', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const cardTitle = compiled.querySelector('mat-card-title');
    const cardContent = compiled.querySelector('mat-card-content');

    expect(cardTitle?.textContent).toContain('User Management');
    expect(cardContent?.textContent).toContain(
      'Create, view, update, and delete users'
    );
  });

  it('should have a button to navigate to users', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Manage Users');
  });
});
