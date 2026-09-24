import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header'; 
import { NavegationBarComponent } from './navegation-bar/navegation-bar'; 
import { CarouselComponent } from './carousel/carousel';
import { DoctorsComponent } from './doctors/doctors'; 
import { PatientsComponent } from './patients/patients'; 
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, 
    NavegationBarComponent,
    CarouselComponent, 
    DoctorsComponent, 
    PatientsComponent, 
    FooterComponent
  ],
  styleUrl: './app.css',   
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('parcial2daParte');
}