import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { BehaviorSubject, Observable, ObservableInput } from 'rxjs';
import { tap, map, throttleTime, mergeMap, scan } from 'rxjs/operators';
import { Post } from '../services/post.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  theEnd = false;

  offset = new BehaviorSubject(null);

  isMobile = new BehaviorSubject<boolean>(null);

  infinite: Observable<Post[]>;

  constructor(private auth: AuthService) {

    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }),
    );

    this.infinite = batchMap.pipe(
      map(v => Object.values(v)),
    );
  }

  ngOnInit(): void {

    if (window.screen.width < 720) {
      this.isMobile.next(true);
    } else {
      this.isMobile.next(null);
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 720) {
      this.isMobile.next(true);
    } else {
      this.isMobile.next(null);
    }
  }

  nextBatch(e, offset): void {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (end === total) {
      this.offset.next(offset);
    }

  }

  getBatch(lasteseen: number): ObservableInput<any> {
    return this.auth.getPosts(lasteseen).pipe(
      tap(arr => (arr.length ? null : (this.theEnd = true))),
      map(arr => {
        return arr.reduce((acc, cur) => {
          const id = cur.payload.doc.id;
          const data = cur.payload.doc.data();
          return { ...acc, [id]: data }
        }, {})
      }),
    );
  }

  trackByIdx(i) {
    return i;
  }

}
