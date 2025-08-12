import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface Property {
  id: string;
  badge?: string;
  image: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  price: string;
  type: string;
  city: string;
  status: 'available' | 'rented' | 'maintenance';
  tenants?: Tenant[];
  maintenanceRequests?: MaintenanceRequest[];
}

interface Tenant {
  id: string;
  name: string;
  contact: string;
  leaseStart: Date;
  leaseEnd: Date;
  rentPaid: boolean;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface Payment {
  id: string;
  propertyId: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue';
}

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, MatProgressBarModule],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent {
    currentLang: string = localStorage.getItem('lang') || 'ar';

  // Modal control properties
  newPropertyModal = false;
  newTenantModal = false;
  newMaintenanceModal = false;
  constructor(private router: Router) {}
  // Property selection
  selectedPropertyForTenant: Property | null = null;

  // Active tab state
  activeTab: 'properties' | 'tenants' | 'payments' | 'maintenance' =
    'properties';

  // Hero section data
  hero = {
    title: 'حلول إدارة وتأجير العقارات المتكاملة',
    subtitle: 'منصة متكاملة لإدارة العقارات وتأجيرها مع تحكم كامل وشفافية تامة',
    image: 'assets/leasing-hero.jpg',
    ctaPrimary: 'عرض لوحة التحكم',
    ctaSecondary: 'إضافة عقار جديد',
  };

  // Features section data
  features: Feature[] = [
    {
      icon: 'home_work',
      title: 'إدارة كاملة',
      description:
        'إدارة شاملة للعقار تشمل المستأجرين، تحصيل الإيجار، والصيانة الدورية',
    },
    {
      icon: 'groups',
      title: 'إدارة المستأجرين',
      description: 'نظام متكامل لإدارة عقود الإيجار وبيانات المستأجرين',
    },
    {
      icon: 'payments',
      title: 'إدارة المدفوعات',
      description: 'تتبع المدفوعات والإشعارات التلقائية للدفعات المتأخرة',
    },
    {
      icon: 'handyman',
      title: 'إدارة الصيانة',
      description: 'نظام طلبات الصيانة وتتبع حالة الإصلاحات',
    },
  ];

  // Filters data
  propertyTypes: FilterOption[] = [
    { label: 'الكل', value: '' },
    { label: 'شقق', value: 'apartment' },
    { label: 'فلل', value: 'villa' },
    { label: 'مكاتب', value: 'office' },
    { label: 'محلات تجارية', value: 'shop' },
  ];

  cities: FilterOption[] = [
    { label: 'الرياض', value: 'riyadh' },
    { label: 'جدة', value: 'jeddah' },
    { label: 'الدمام', value: 'dammam' },
    { label: 'مكة المكرمة', value: 'mecca' },
  ];

  statusOptions: FilterOption[] = [
    { label: 'الكل', value: '' },
    { label: 'متاح', value: 'available' },
    { label: 'مؤجر', value: 'rented' },
    { label: 'صيانة', value: 'maintenance' },
  ];

  // Selected filters
  selectedPropertyType: string = '';
  selectedCity: string = '';
  selectedStatus: string = '';

  // Properties data
  properties: Property[] = [
    {
      id: '1',
      badge: 'متوفر الآن',
      image: 'assets/apartment-1.jpg',
      title: 'شقة فاخرة - حي السفارات',
      bedrooms: 3,
      bathrooms: 2,
      size: 180,
      price: '25,000 ر.س/شهر',
      type: 'apartment',
      city: 'riyadh',
      status: 'available',
      tenants: [],
    },
    {
      id: '2',
      image: 'assets/villa-1.jpg',
      title: 'فيلا راقية - حي الياسمين',
      bedrooms: 5,
      bathrooms: 3,
      size: 350,
      price: '45,000 ر.س/شهر',
      type: 'villa',
      city: 'jeddah',
      status: 'rented',
      tenants: [
        {
          id: 't1',
          name: 'أحمد محمد',
          contact: '0555123456',
          leaseStart: new Date('2023-01-01'),
          leaseEnd: new Date('2024-01-01'),
          rentPaid: true,
        },
      ],
      maintenanceRequests: [
        {
          id: 'm1',
          title: 'تصليح تكييف',
          description: 'التكييف في الغرفة الرئيسية لا يعمل',
          date: new Date('2023-06-15'),
          status: 'completed',
        },
      ],
    },
  ];

  // Payments data
  payments: Payment[] = [
    {
      id: 'p1',
      propertyId: '2',
      amount: 45000,
      date: new Date('2023-07-01'),
      status: 'paid',
    },
    {
      id: 'p2',
      propertyId: '2',
      amount: 45000,
      date: new Date('2023-08-01'),
      status: 'pending',
    },
  ];

  // Maintenance requests
  maintenanceRequests: MaintenanceRequest[] = [
    {
      id: 'm2',
      title: 'تصليح تسرب مياه',
      description: 'تسرب مياه في الحمام الرئيسي',
      date: new Date('2023-07-10'),
      status: 'in-progress',
    },
  ];

  // Process steps data
  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'تسجيل العقار',
      description: 'قم بتسجيل عقارك عبر المنصة أو عن طريق زيارة أحد مكاتبنا',
    },
    {
      number: 2,
      title: 'التقييم والتسعير',
      description: 'يقوم خبراؤنا بتقييم العقار وتحديد سعر إيجار مناسب للسوق',
    },
    {
      number: 3,
      title: 'العرض والتسويق',
      description:
        'نقوم بتسويق العقار عبر منصاتنا وشركائنا لإيجاد المستأجر المناسب',
    },
    {
      number: 4,
      title: 'التأجير والإدارة',
      description: 'ننهي الإجراءات القانونية ونبدأ بإدارة العقار نيابة عنك',
    },
  ];

  // CTA section data
  cta = {
    title: 'هل ترغب في إدارة عقارك باحترافية؟',
    description: 'سجل معنا الآن واستفد من نظامنا المتكامل لإدارة العقارات',
    button: 'تسجيل عقار جديد',
  };

  // New property form
  newProperty = {
    title: '',
    type: '',
    city: '',
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    price: '',
  };

  // New tenant form
  newTenant = {
    name: '',
    contact: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: 0,
  };

  // New maintenance request
  newMaintenanceRequest = {
    title: '',
    description: '',
  };

  // Filtered properties
  get filteredProperties(): Property[] {
    return this.properties.filter((property) => {
      const typeMatch =
        !this.selectedPropertyType ||
        property.type === this.selectedPropertyType;
      const cityMatch =
        !this.selectedCity || property.city === this.selectedCity;
      const statusMatch =
        !this.selectedStatus || property.status === this.selectedStatus;
      return typeMatch && cityMatch && statusMatch;
    });
  }

  // Get all tenants
  get allTenants(): Tenant[] {
    return this.properties
      .filter((p) => p.tenants && p.tenants.length > 0)
      .flatMap((p) => p.tenants || []);
  }

  // Get properties with tenants
  get rentedProperties(): Property[] {
    return this.properties.filter((p) => p.status === 'rented');
  }

  // Get overdue payments
  get overduePayments(): Payment[] {
    const today = new Date();
    return this.payments.filter(
      (p) =>
        p.status === 'pending' &&
        p.date <
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  }

  // Get active maintenance requests
  get activeMaintenance(): MaintenanceRequest[] {
    return [
      ...this.maintenanceRequests,
      ...this.properties
        .filter((p) => p.maintenanceRequests)
        .flatMap((p) => p.maintenanceRequests || []),
    ].filter((m) => m.status !== 'completed');
  }

  // Get count of pending payments
  get pendingPaymentsCount(): number {
    if (!this.payments) return 0;
    return this.payments.filter((p) => p.status === 'pending').length;
  }

  /* ================ */
  /* UTILITY METHODS */
  /* ================ */

  // Get property by ID
  getPropertyById(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  // Get tenant for property
  getTenantForProperty(propertyId: string): Tenant | undefined {
    const property = this.getPropertyById(propertyId);
    return property?.tenants?.[0]; // Assuming one tenant per property
  }

  // Get property for tenant
  getPropertyForTenant(tenant: Tenant): Property | undefined {
    return this.properties.find((p) =>
      p.tenants?.some((t) => t.id === tenant.id)
    );
  }

  /* ================ */
  /* ACTION METHODS */
  /* ================ */

  // Tab management
  setActiveTab(
    tab: 'properties' | 'tenants' | 'payments' | 'maintenance'
  ): void {
    this.activeTab = tab;
  }

  // Property actions
  viewPropertyDetails(property: Property): void {
    console.log('View property details:', property);
    // In a real app, this would navigate to property details page
  }

  addNewProperty(): void {
    const newProp: Property = {
      id: Date.now().toString(),
      title: this.newProperty.title,
      type: this.newProperty.type,
      city: this.newProperty.city,
      bedrooms: this.newProperty.bedrooms,
      bathrooms: this.newProperty.bathrooms,
      size: this.newProperty.size,
      price: this.newProperty.price + ' ر.س/شهر',
      status: 'available',
      image: 'assets/default-property.jpg',
    };
    this.properties.push(newProp);
    this.resetNewPropertyForm();
    this.newPropertyModal = false;
    console.log('New property added:', newProp);
  }

  resetNewPropertyForm(): void {
    this.newProperty = {
      title: '',
      type: '',
      city: '',
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      price: '',
    };
  }

  // Tenant actions
  addTenant(property: Property): void {
    if (!property.tenants) property.tenants = [];

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: this.newTenant.name,
      contact: this.newTenant.contact,
      leaseStart: new Date(this.newTenant.leaseStart),
      leaseEnd: new Date(this.newTenant.leaseEnd),
      rentPaid: false,
    };

    property.tenants.push(newTenant);
    property.status = 'rented';
    this.resetNewTenantForm();
    this.newTenantModal = false;
    console.log('New tenant added:', newTenant);
  }

  resetNewTenantForm(): void {
    this.newTenant = {
      name: '',
      contact: '',
      leaseStart: '',
      leaseEnd: '',
      rentAmount: 0,
    };
  }

  // Maintenance actions
  addMaintenanceRequest(property?: Property): void {
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      title: this.newMaintenanceRequest.title,
      description: this.newMaintenanceRequest.description,
      date: new Date(),
      status: 'pending',
    };

    if (property) {
      if (!property.maintenanceRequests) {
        property.maintenanceRequests = [];
      }
      property.maintenanceRequests.push(newRequest);
      property.status = 'maintenance';
    } else {
      this.maintenanceRequests.push(newRequest);
    }

    this.resetNewMaintenanceForm();
    this.newMaintenanceModal = false;
    console.log('New maintenance request added:', newRequest);
  }

  resetNewMaintenanceForm(): void {
    this.newMaintenanceRequest = {
      title: '',
      description: '',
    };
  }

  // Payment actions
  recordPayment(payment: Payment): void {
    payment.status = 'paid';
    console.log('Payment recorded:', payment);
  }

  // Search function
  searchProperties(): void {
    console.log('Searching with filters:', {
      type: this.selectedPropertyType,
      city: this.selectedCity,
      status: this.selectedStatus,
    });
  }

  // Register property
  registerProperty(): void {
    console.log('Register new property');
    this.setActiveTab('properties');
    this.newPropertyModal = true;
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
