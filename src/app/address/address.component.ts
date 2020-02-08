import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  btnDisabled = false;
  currentAddress: any;
  quantities = [];
  checkoutButton: boolean;
  handler: any;
  shippingForm: FormGroup;
  editButtons = false;

  // tslint:disable-next-line:max-line-length
  constructor(private data: DataService, private rest: RestApiService, private router: Router, private dataRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.createFormWithFormBuilder();
    this.shippingForm.disable();
  }

  createFormWithFormBuilder() {
    this.shippingForm = this.formBuilder.group({
      address1: [null, Validators.required],
      address2: [null, Validators.required],
      mobile: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      postalCode: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.shippingForm.disable();
    if (this.dataRoute.snapshot.params.state) {
      const routeData = JSON.parse(this.dataRoute.snapshot.params.state);
      this.checkoutButton = routeData.checkoutButton;
      this.quantities = routeData.quantities;
    } else {
      this.shippingForm.enable();
    }
    try {
      const data = await this.rest.get(
        environment.apiUrl + '/api/accounts/address'
      );

      if (
        JSON.stringify(data['address']) === '{}' &&
        this.data.message === ''
      ) {
        this.data.warning(
          'You have not entered your shipping address. Please enter your shipping address.'
        );
      }
      this.currentAddress = data['address'];
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  editAddress() {
    this.shippingForm.enable();
    this.editButtons = true;
    this.checkoutButton = false;
  }

  cancelEdit() {
    this.shippingForm.disable();
    this.editButtons = false;
    this.checkoutButton = true;
  }

  async onSubmit(form) {
    this.shippingForm.disable();
    this.editButtons = false;
    this.checkoutButton = true;
    this.updateAddress();
  }

  async updateAddress() {
    console.log('this.currentAddress ', this.currentAddress);
    try {
      const res = await this.rest.post(
        environment.apiUrl + '/api/accounts/address',
        this.currentAddress
      );

      res['success']
        ? (this.data.success(res['message']), await this.data.getProfile())
        : this.data.error(res['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
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

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'Grand Designs',
          description: 'Checkout Payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          },
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error(error);
    }
  }

}
