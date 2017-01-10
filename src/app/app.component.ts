import { Component } from '@angular/core';
import {HttpService} from './services/http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    products;
    name: string = 'Han Solo';
    cart = [];
    sumTotal: string = '0';
    restrictions = '';

    constructor(private httpService: HttpService) {
        httpService.productsAnnounced$.subscribe(
        (value) => {
            this.assignProducts(value);
        });
    }

    assignProducts(products) {
        products.forEach(function(p) {
            p.quantity = 0;
        });

        this.products = products;
    }

    checkRestrictions() {
        let reviiveCount = 0;
        let puritiiCount = 0;
        this.restrictions = '';

        for (let i = 0; i < this.cart.length; i++) {
            let product = this.cart[i];

            // check for bottles
            if (product.productName.includes('Blender Bottle') && product.quantity > 1) {
                let msg = "You can't order more than 1 blender bottle";
                this.restrictions = this.restrictions.length ? `${this.restrictions} ${msg}.` : `${msg}.`;
            }
            // check for reviive
            if (product.productName.includes('Reviive')) {
                let msg = "You can't order more than 2 reviive products";
                reviiveCount = reviiveCount + product.quantity;
                if (reviiveCount > 2) {
                    this.restrictions = this.restrictions.length ? `${this.restrictions} ${msg} either.` : `${msg}.`;
                }
            }
            // check for puritii
            if (product.productName.includes('Puritii')) {
                let msg = "You can't order more than one Puritii product";
                puritiiCount = puritiiCount + product.quantity;
                if (puritiiCount > 1) {
                    this.restrictions = this.restrictions.length ? `${this.restrictions} ${msg}. It's a hard life, I know.` : `${msg}.`;
                }
            }
        }
    }

    onChange() {
        this.selectedProducts();
        this.checkRestrictions();
    }

    checkTotal() {
        return parseFloat(this.sumTotal) > 200;
    }

    totalProducts() {
        let total = 0;

        this.products.forEach(function(p) {
            total = total + (p.productPrice * p.quantity);
        });

        this.sumTotal = total.toFixed(2);

        return this.sumTotal;
    }

    selectedProducts() {
        let cart = [];

        this.products.forEach(function(p) {
            if (p.quantity > 0) {
                let newProd = {
                    'productName' : p.productName,
                    'quantity' : p.quantity
                }
                cart.push(newProd);
            }
        });

        this.cart = cart;
    }

    emailToSend() {
        let stringify = '';

        this.products.forEach(function(p) {
            if (p.quantity > 0) {
                stringify = stringify + `${p.quantity} of ${p.productName}, `;
            }
        });
        stringify = `Hey Ariix Operations! Can I get these products for my monthly order? `
            + stringify.substring(0, stringify.length - 2)
            + ` Thanks! –${this.name}`;

        return `mailto:ops@ariix.com?Subject=Monthly%20Order&Body=${encodeURIComponent(stringify)}`;
    }
}
