import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  animations: [trigger('fadeAnimation', [
    state('void', style({
      opacity: 0
    })),
    transition('void <=> *', animate(200)),
  ])]
})
export class LoadingComponent implements OnInit {

  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private cd: ChangeDetectorRef,public ls: LoadingService) {}
  
  //https://github.com/angular/angular/issues/17572
  ngOnInit(){
      this.ls.isLoading$.subscribe(data=>{
         const pre = this.isLoading.getValue();
         this.isLoading.next(data);
         if(pre === false && data === true){
           this.cd.detectChanges();
         }
      })
  }
}
