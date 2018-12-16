import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  filterData: any[];
  searchTerm: string;
  url1: string;
  title: string;
  public items = [];
  public data: Observable<any>;
  url: string;
  page: number = 1;
  @Input() path: string = "/assets/imgs/";
  defaultimgPath: string = this.path + '/placeholder_for_missing_posters.png';
  constructor(public navCtrl: NavController, public http: HttpClient) {
    this.url = this.getUrl(this.page);
    this.data = this.http.get(this.url);
    this.data.subscribe(data => {
      this.items.push(data);
      this.filterData = this.items;
      this.title = data.page.title;
      this.page++;
    });
  }

  getUrl(page) {
    return 'http://localhost:8100/assets/CONTENTLISTINGPAGE-PAGE' + page + '.json';
  }

  doInfinite(infiniteScroll) {
    if (this.page <= 3) {
      this.url = this.getUrl(this.page);
      this.data = this.http.get(this.url);
      this.data.subscribe(data => {
        this.items.push(data);
        this.filterData = this.items;
        this.title = data.page.title;
      });
      this.page++;
      infiniteScroll.complete();
    }
  }

  searchItem(event) {
    this.filterData = this.items.map((i) => {
      return {
        'page': {
          'content-items': {
            'content': i.page["content-items"].content.filter((x) => x.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
          }
        }

      }
    });
  }

}
