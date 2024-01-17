import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css'],
})
export class CollectionsComponent implements OnInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;
  collections: Collection[];
  loading: boolean = false;
  nextPageLoading: boolean = false;
  observer: any;
  currentPage: number = 1;
  paginationInfo: any;
  responseArrayLength: number = 0;

  constructor(
    private collectionService: CollectionService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.collections = [];

    this.intersectionObserver();
    this.getAllCollections();
  }

  private getAllCollections() {
    if (!this.loading) {
      this.nextPageLoading = true;
    }

    this.collectionService
      .getAllPublicCollections(8, this.currentPage)
      .subscribe(async (data: any) => {
        

        if (data != undefined || data.Content != null) {
          this.collections.push(...data.Content);
          this.paginationInfo = data.PaginationInfo;
        }
        this.loading = false;
        this.nextPageLoading = false;
      });
  }

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  intersectionObserver() {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.paginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.getAllCollections();
        }
      }
    }, option);
  }

  public back() {
    this.location.back();
  }
}
