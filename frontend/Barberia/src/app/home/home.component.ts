import { Component, ViewEncapsulation, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    const leftArrow = document.querySelector('.arrow.left img');
    const rightArrow = document.querySelector('.arrow.right img');
    const carousel = document.querySelector('.testimonial-carousel');
    
    if (leftArrow && rightArrow && carousel) {
      leftArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
      });

      rightArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
      });
    }

    this.addScrollEvent();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.addScrollEvent();
  }

  addScrollEvent() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }
}
