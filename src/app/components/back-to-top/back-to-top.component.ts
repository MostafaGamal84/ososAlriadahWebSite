import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent {
  showButton: boolean = false;
audio = new Audio('https://ajyalalquran.somee.com/assets/voice.mp3');
isPlaying = false;

showButtom = false;
showSocialLinks = false;

toggleSocialLinks() {
  this.showSocialLinks = !this.showSocialLinks;
}

// playAudio(): void {
//   if (this.audio.paused) {
//     // ▶️ Play audio
//     this.audio.loop = true;
//     this.audio.volume = 0.5;
//     console.log('🔊 Attempting to play audio...');
//     this.audio.play().then(() => {
//       this.isPlaying = true;
//       console.log('✅ Audio playing');
//     }).catch((err) => {
//       console.warn('Playback failed:', err);
//     });
//   } else {
//     // ⏸️ Pause audio
//     this.audio.pause();
//     this.isPlaying = false;
//     console.log('🔇 Audio paused');
//   }
// }
  // Listen for the window's scroll event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if the scroll position is greater than 100vh
    this.showButton = window.scrollY > window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
}
