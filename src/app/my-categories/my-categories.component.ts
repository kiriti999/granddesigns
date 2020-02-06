import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {

  categories: any;

  newCategory = '';
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const data = await this.rest.get(
        environment.apiUrl + '/api/categories'
      );
      console.log('cate', data['sucess']);
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(
        environment.apiUrl + '/api/categories',
        { category: this.newCategory }
      );
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

  async deleteCategory(e) {
    try {
      const data = await this.rest.get(environment.apiUrl + `/api/categories/delete/?id=${e.target.id}`);
      // tslint:disable-next-line:max-line-length
      if (data['success']) {
        this.categories = (this.categories.filter(e => e._id != (data['categories'].id)));
        this.loadCategories();
      } else {
        this.data.error(data['message']);
      }

      console.log('filtered ', this.categories);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  editName() {

  }

}

