import { Pipe, PipeTransform, inject } from '@angular/core';
import { SiteContentService } from './site-content.service';
@Pipe({name:'cmsText', standalone:true, pure:false})
export class CmsTextPipe implements PipeTransform {
  private cms = inject(SiteContentService);
  transform(value: unknown, key: string): string { return this.cms.value(value, key); }
}
