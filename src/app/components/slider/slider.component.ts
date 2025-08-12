import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ContactService } from '../../services/contact.service';

interface TestimonialSlide {
  image: string;
  title: { ar: string; en: string };
  gender: { ar: string; en: string };
  subtitle: { ar: string; en: string };
}


@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  slides: TestimonialSlide[] = [
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ.فاطمة عثمان (حفص - قالون)', en: 'Ms. Fatima Othman (Hafs - Qalun)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'حفص مع أ. أمل أبو الفتوح - قالون مع أ. سماح حسين', en: 'Hafs with Ms. Amal Abu Al-Fotouh - Qalun with Ms. Samah Hussein' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. أسماء سعيد( عاصم وقالون)', en: 'Ms. Asmaa Saeed (Asim and Qalun)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'عاصم مع أ. هبة محمد - قالون مع أ. عزة عطا', en: 'Asim with Ms. Heba Mohamed - Qalun with Ms. Azza Atta' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. أمل كامل (حفص)', en: 'Ms. Amal Kamel (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. فاطمة عثمان', en: 'With Ms. Fatima Othman' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. ايمان كامل (حفص)', en: 'Ms. Iman Kamel (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. فاطمة عثمان', en: 'With Ms. Fatima Othman' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. آيات عاطف(حفص)', en: 'Ms. Ayat Atef (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. فاطمة عثمان', en: 'With Ms. Fatima Othman' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. إيمان صلاح (حفص)', en: 'Ms. Iman Salah (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. فاطمة عثمان', en: 'With Ms. Fatima Othman' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. شيماء محمد (حفص)', en: 'Ms. Shaimaa Mohamed (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. فاطمة أحمد', en: 'With Ms. Fatima Ahmed' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. آلاء عبد الباسط (حفص)', en: 'Ms. Alaa Abdelbaset (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. عبير النيل', en: 'With Ms. Abeer El-Neil' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'أ. أسماء عبد الفتاح (حفص)', en: 'Ms. Asmaa Abdelfattah (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. إيمان زكريا', en: 'With Ms. Iman Zakaria' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/girl.jpg',
    title: { ar: 'صفاء كامل (حفص)', en: 'Safa Kamel (Hafs)' },
    gender: { ar: 'طالبة', en: 'Student' },
    subtitle: { ar: 'مع أ. إلهام رشاد', en: 'With Ms. Elham Rashad' },
  },

  // ... (تم تجهيز أكثر من 30 شريحة بنفس الطريقة)

  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'د.أحمد هنداوي', en: 'Dr. Ahmed Hendawy' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ رمضان ربيع', en: 'With Sheikh Ramadan Rabie' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.ٲنس محمد حسني (اجازة عاصم)', en: 'Mr. Anas Mohamed Hosny (Ijazah in Asim)' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم إيهاب صلاح', en: 'With Ustadh Ihab Salah' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.معتز عادل', en: 'Mr. Moataz Adel' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ معتز نايل', en: 'With Sheikh Moataz Nail' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.محمد رضوان', en: 'Mr. Mohamed Redwan' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ مصطفى النص', en: 'With Sheikh Mostafa Al-Nass' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.يحيى السميني (اجازة عاصم)', en: 'Mr. Yahya Al-Samaini (Ijazah in Asim)' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ أحمد فكري', en: 'With Sheikh Ahmed Fekry' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.أسامة يوسف', en: 'Mr. Osama Youssef' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ أحمد أبوبكر', en: 'With Sheikh Ahmed Abu Bakr' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'د.محمود الديب', en: 'Dr. Mahmoud El-Deeb' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ أحمد أبوبكر', en: 'With Sheikh Ahmed Abu Bakr' },
  },
  {
    image: 'https://ajyalalquran.somee.com/assets/images/boy.jpg',
    title: { ar: 'أ.أحمد يحيى', en: 'Mr. Ahmed Yahya' },
    gender: { ar: 'طالب', en: 'Student' },
    subtitle: { ar: 'مع المعلم الشيخ أحمد سعد', en: 'With Sheikh Ahmed Saad' },
  }
];

  private swiper: Swiper | undefined;

constructor(public contactService: ContactService) {
  }
  currentLang: string = 'ar';

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang === 'en' ? 'en' : 'ar';
  }


  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.swiper', {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: '.next-button',
        prevEl: '.prev-button',
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
      },
    });
  }
}
