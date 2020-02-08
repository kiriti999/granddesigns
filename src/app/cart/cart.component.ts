import { GlobalService } from './../services/global.service';
import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  btnDisabled = false;
  handler: any;

  quantities = [];

  constructor(
    private data: DataService,
    private router: Router,
    private globalService: GlobalService
  ) { }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.globalService.cartItems().forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.globalService.cartItems().forEach(data => {
      this.quantities.push(1);
    });
    this.handler = this.globalService.enableStripe();
  }


  checkout() {
    this.globalService.checkout();
  }

  goToAddressPage() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/profile/address', { state: JSON.stringify({ checkoutButton: true, quantities: this.quantities }) }]);
  }

}
