import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {

  cart: Cart = { items: [{
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id:1,
    },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id:2,
  }] };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product', 'name','price','quantity','total','action',
  ];  

  constructor(private cartService: CartService, private http: HttpClient){}
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });

   
  }
getTotal(items: Array<CartItem>): number {
  return this.cartService.getTotal(items);
};

onClearcart(): void
{
  this.cartService.clearCart();
}  

onRemoveFromCart(item: CartItem): void{
   this.cartService.removeFromCart(item);
}
onAddQuantity(item: CartItem): void {
  this.cartService.addToCart(item);
}
onRemoveQuantity(item: CartItem): void {
  this.cartService.removeQuantity(item);
}

onCheckout(): void {
  this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    })
    .subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51NGQ9TSHAh0sAbGoiqTuoqvENgPzb2GFTGuIvS3DdDC2ZBwpILBZFlqTyetqg7AK85pAiD4hSedUj7GDimdfXGeI00pd0MjjRM');
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    });
}



}


