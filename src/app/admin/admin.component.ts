import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminApi, apiError, AuctionRecord, ProjectRecord } from '../services/admin-api.service';
import { SiteContentService } from '../services/site-content.service';

@Component({selector:'app-admin',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./admin.component.html',styleUrl:'./admin.component.css'})
export class AdminComponent {
  api=inject(AdminApi); cms=inject(SiteContentService); router=inject(Router);
  checking=true; authenticated=false; username=''; password=''; busy=false; message=''; error='';
  tab:'auctions'|'projects'='auctions'; auctions:AuctionRecord[]=[];projects:ProjectRecord[]=[];
  editing: any=null; original=''; pendingDelete:any=null;
  get dirty(){return this.editing && JSON.stringify(this.editing)!==this.original;}
  get rows():any[]{return this.tab==='auctions'?this.auctions:this.projects;}
  async ngOnInit(){try{await this.api.me();await this.api.csrf();this.authenticated=true;await this.load();}catch{}finally{this.checking=false;}}
  async login(){this.busy=true;this.error='';try{await this.api.login(this.username,this.password);this.password='';this.authenticated=true;await this.load();}catch(e){this.error=apiError(e);}finally{this.busy=false;}}
  async logout(){if(!this.discard())return;try{await this.api.logout();this.authenticated=false;}catch(e){this.error=apiError(e);}}
  async load(){this.busy=true;this.error='';try{[this.auctions,this.projects]=await Promise.all([this.api.list<AuctionRecord>('auctions'),this.api.list<ProjectRecord>('projects')]);}catch(e){this.error=apiError(e);}finally{this.busy=false;}}
  discard(){if(this.dirty && !confirm('هل تريد تجاهل التعديلات غير المحفوظة؟'))return false;this.editing=null;this.pendingDelete=null;return true;}
  switchTab(tab:'auctions'|'projects'){if(this.discard()){this.tab=tab;this.message='';this.error='';}}
  edit(row?:any){if(!this.discard())return;
    this.editing=row?structuredClone(row):this.tab==='auctions'?{id:0,name:'',nameEn:'',content:'',contentEn:'',start:'',end:'',imagePath:'',pdfPath:'',url:'',openingPrice:0,agentName:'',city:'',district:'',published:false,version:1}:{id:0,titleAr:'',titleEn:'',descAr:'',descEn:'',image:'',pdfUrl:'',featured:false,published:false,sortOrder:0,version:1};
    if(this.tab==='auctions' && row){this.editing.start=this.localDate(row.start);this.editing.end=this.localDate(row.end);}
    this.original=JSON.stringify(this.editing);this.error='';this.message='';
  }
  localDate(value:string){const date=new Date(value);date.setMinutes(date.getMinutes()-date.getTimezoneOffset());return date.toISOString().slice(0,16);}
  async save(){this.busy=true;this.error='';try{
    const value=structuredClone(this.editing);
    if(this.tab==='auctions'){
      if(!value.start||!value.end||new Date(value.end)<=new Date(value.start))throw new Error('يجب أن تكون نهاية المزاد بعد بدايته.');
      value.start=new Date(value.start).toISOString();value.end=new Date(value.end).toISOString();
    }
    await this.api.save(this.tab,value);this.editing=null;await this.load();this.message='تم حفظ البيانات بنجاح.';
  }catch(e:any){this.error=e.status!==undefined?apiError(e):e.message;}finally{this.busy=false;}}
  async remove(){if(!this.pendingDelete)return;this.busy=true;this.error='';try{await this.api.remove(this.tab,this.pendingDelete.id,this.pendingDelete.version);this.pendingDelete=null;await this.load();this.message='تم حذف العنصر.';}catch(e){this.error=apiError(e);}finally{this.busy=false;}}
  async upload(event:Event,field:string){const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;this.busy=true;this.error='';try{if(file.size>20*1024*1024)throw new Error('حجم الملف يجب ألا يتجاوز 20 ميجابايت.');this.editing[field]=(await this.api.upload(file)).url;}catch(e:any){this.error=e.status!==undefined?apiError(e):e.message;}finally{this.busy=false;input.value='';}}
  async live(){if(!this.discard())return;this.busy=true;this.error='';try{await this.cms.begin();document.body.classList.add('cms-selecting');await this.router.navigateByUrl('/');}catch(e){this.error=apiError(e);}finally{this.busy=false;}}
  @HostListener('window:beforeunload',['$event']) beforeUnload(event:BeforeUnloadEvent){if(this.dirty){event.preventDefault();event.returnValue='';}}
}
