import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Project {
  id: number;
  titleAr: string;
  descAr: string;
  titleEn: string;
  descEn: string;
  image: string;
  pdfUrl: string; // <-- make sure each project has this

}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  // language & direction
  currentLang: string = localStorage.getItem('lang') || 'ar';
  // start with NO active card (no shade open)
  activeIndex = -1;
 constructor(private router: Router) {}
projects: Project[] = [
  {
    id: 1,
    titleAr: 'مشروع المصيف المرحلة الاولى- تبوك',
    descAr:
      'تصميم داخلي مودرن دافئ بالمصيف–تبوك؛ استقبال ومعيشة ومطبخ مفتوح وغرف نوم بمواد طبيعية وإضاءة مخفية.',
    titleEn: 'Al-Maseef Residence Round 1 – Tabuk',
    descEn:
      'Warm-modern interior in Al-Maseef, Tabuk: reception, living, open kitchen, bedrooms; natural finishes and layered lighting.',
    image: 'https://osos-alriadah.com/assets/projects/almasiaf1.jpeg',
    pdfUrl: 'https://osos-alriadah.com/assets/projects/almasiaf-1.pdf'
  },
  {
    id: 2,
    titleAr: 'مشروع المصيف المرحلة الثانية - تبوك',
    descAr:
      'استكمال الطابع المودرن الدافئ؛ استقبال ومعيشة ومطبخ مفتوح وغرف نوم بمواد طبيعية وإضاءة خفية.',
    titleEn: 'Al-Maseef Residence Round 2 – Tabuk',
    descEn:
      'Phase two: warm-modern styling with open living/dining, kitchen, bedrooms; natural materials and concealed LED layers.',
    image: 'https://osos-alriadah.com/assets/projects/almasiaf2.jpeg',
    pdfUrl: 'https://osos-alriadah.com/assets/projects/almasiaf-2.pdf'
  },
  {
    id: 3,
    titleAr: 'مشروع النخيل فيلا - الطابق الأرضي',
    descAr:
      'طابق أرضي: صالة مفتوحة على السفرة، مدخل أنيق، مطبخ تحضيري، غرفة ضيوف؛ ألوان هادئة وإضاءة مخفية.',
    titleEn: 'Al-Nakheel Villa – Ground Floor',
    descEn:
      'Ground floor: open living–dining, elegant foyer, prep kitchen, guest room; soft palette and indirect lighting.',
    image: 'https://osos-alriadah.com/assets/projects/alnakheel1.jpeg',
    pdfUrl: 'https://osos-alriadah.com/assets/projects/alnakheel-1.pdf'
  },
  {
    id: 4,
    titleAr: 'مشروع النخيل فيلا - الطابق الأول',
    descAr:
      'طابق أول: جناح رئيسي، غرفتا أطفال بحمام مشترك، صالة عائلية وبانتري وشرفة؛ خامات دافئة وإضاءة متعددة.',
    titleEn: 'Al-Nakheel Villa – First Floor',
    descEn:
      'First floor: master suite, two kids’ rooms with shared bath, family lounge with pantry and balcony; warm materials, layered lighting.',
    image: 'https://osos-alriadah.com/assets/projects/alnakheel2.jpeg',
    pdfUrl: 'https://osos-alriadah.com/assets/projects/alnakheel-2.pdf'
  }
];


  // computed progress width (0% when none active)
  get progressPercent(): number {
    return this.activeIndex >= 0
      ? ((this.activeIndex + 1) / this.projects.length) * 100
      : 0;
  }

  // interactions
  setActive(i: number) { this.activeIndex = i; }
  clearActive() { this.activeIndex = -1; }

  next() {
    if (this.projects.length === 0) return;
    this.activeIndex = this.activeIndex < 0
      ? 0
      : (this.activeIndex + 1) % this.projects.length;
  }

  prev() {
    if (this.projects.length === 0) return;
    this.activeIndex = this.activeIndex < 0
      ? this.projects.length - 1
      : (this.activeIndex - 1 + this.projects.length) % this.projects.length;
  }

  trackById = (_: number, p: Project) => p.id;

  openPdf(p: Project) {
    const title = this.currentLang === 'ar' ? p.titleAr : p.titleEn;
    this.router.navigate(
      ['/preview'],
      { queryParams: { url: encodeURIComponent(p.pdfUrl), title } }
    );
  }
}
