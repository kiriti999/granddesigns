import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  products: any;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(environment.apiUrl + '/api/seller/products');
      data['success'] ? (this.products = data['products']) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  editProduct(e) {
    console.log('edit   ', e.target.id);
  }

  async deleteProduct(e) {
    try {
      const data = await this.rest.get(environment.apiUrl + `/api/seller/products/delete/?id=${e.target.id}`);
      data['success'] ? this.products = (this.products.filter(e => e != (data['products'].id))) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
