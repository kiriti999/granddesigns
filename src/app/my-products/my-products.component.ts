import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  products: any;
  categories: any;
  readOnlyMode = true;
  editOnlyMode = false;
  btnDisabled = false;

  product = {
    title: '',
    price: 0,
    categoryId: '',
    description: '',
    product_picture: null,
    product_image_name: ''
  };

  constructor(private data: DataService, private rest: RestApiService, private router: Router) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        environment.apiUrl + '/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }

    try {
      const data = await this.rest.get(environment.apiUrl + '/api/seller/products');
      console.log('data ', data);
      data['success'] ? (this.products = data['products']) : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async deleteProduct(e) {
    try {
      const data = await this.rest.get(environment.apiUrl + `/api/seller/products/delete/?id=${e.target.id}`);
      data['success'] ? this.products = (this.products.filter(e => e._id != (data['products'].id))) : this.data.error(data['message']);
      console.log('filtered ', this.products);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getById(e) {
    console.log('getById   ', e.target.id);
    this.editOnlyMode = true;
    this.readOnlyMode = false;

    try {
      const data = await this.rest.get(environment.apiUrl + `/api/seller/products/getById/?id=${e.target.id}`);
      console.log('data ', data);
      data['success'] ? (this.products = data['products']) : this.data.error(data['message']);
      console.log('filtered ', this.products);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if (product.description) {
            if (product.product_picture) {
              return true;
            } else {
              this.data.error('Please select product image.');
            }
          } else {
            this.data.error('Please enter description.');
          }
        } else {
          this.data.error('Please select category.');
        }
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }
  }

  async postChanges(product) {
    this.btnDisabled = true;
    try {
      if (this.validate(product)) {
        console.log('product ', product);
        const data = await this.rest.post(environment.apiUrl + '/api/seller/products/edit', product);
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
        this.editOnlyMode = false;
        this.readOnlyMode = true;
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
