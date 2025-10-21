import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
  type Contact = { name: string; phone: string; message?: string };
@Component({
  selector: 'app-back-to-top',
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css',
})
export class BackToTopComponent {
  showButton: boolean = false;
  isPlaying = false;

  showButtom = false;
  showSocialLinks = false;
  showWhatsLinks = false;

  toggleSocialLinks() {
    this.showSocialLinks = !this.showSocialLinks;
  }

contacts: Contact[] = [
  { name: 'دكتور عبدالرحمن سلطان الحربي',   phone: '+966575060000', message: '' },
  { name: 'محمد السيد - خدمة العملاء', phone: '+966532000340'},
  { name: 'احمد مصطفى - خدمة العملاء',   phone: '+966532000390' },
  
  
];

toggleWhatsLinks(): void {
  this.showWhatsLinks = !this.showWhatsLinks;
}

/** Digits-only phone for wa.me */
formatPhone(p: string): string {
  return (p || '').replace(/\D/g, '');
}

/** Build a safe wa.me link with optional prefilled text */
waLink(c: Contact): string {
  const phone = this.formatPhone(c.phone);
  const txt = c.message ? ('?text=' + encodeURIComponent(c.message)) : '';
  return `https://wa.me/${phone}${txt}`;
}

/** TrackBy */
trackByName = (_: number, c: Contact) => c.name;

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
