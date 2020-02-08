import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  handler: any;
  quantities = [];


  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {
    this.cartItems().forEach(data1 => {
      this.quantities.push(1);
    });
  }

  enableStripe() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'assets/img/logo.png',
      locale: 'auto',
      token: async stripeToken => {
        let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d['_id'],
            quantity: this.quantities[index],
          });
        });

        try {
          const data = await this.rest.post(
            environment.apiUrl + '/api/payment',
            {
              totalPrice: this.cartTotal,
              products,
              stripeToken,
            },
          );
          data['success']
            ? (this.data.clearCart(), this.data.success('Purchase Successful.'))
            : this.data.error(data['message']);
        } catch (error) {
          this.data.error(error['message']);
        }
      },
    });
  }

  cartItems() {
    console.log('this.data.getCart() ', this.data.getCart());
    return this.data.getCart();
  }

  cartTotal() {
    let total = 0;
    this.cartItems().forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning('Quantity cannot be less than one.');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else {
      this.data.message = '';
      return true;
    }
  }

  checkout() {
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'Grand Designs',
          description: 'Checkout Payment',
          amount: this.cartTotal() * 100,
          closed: () => { },
        });
      } else {
      }
    } catch (error) {
      this.data.error(error);
    }
  }
}
