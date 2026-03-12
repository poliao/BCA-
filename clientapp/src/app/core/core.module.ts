import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { HttpService } from './http/http.service';
import { LazyTranslationService } from './translate-extension/lazy-translation.service';
import { TranslateHttpLoader } from './translate-extension/translate-http-loader';

export function HttpLoaderFactory(lazy: LazyTranslationService) {
  lazy.add('all');
  return new TranslateHttpLoader(lazy);
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      extendedTimeOut: 2000,
      progressBar: true,
      newestOnTop: false
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [LazyTranslationService]
      }
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HttpClient, useClass: HttpService }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`Core module has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
