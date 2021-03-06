import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  isRoot: boolean
  pending = false
  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.isRoot= this.router.url === '/order'
      }
    })
  }
  ngOnDestroy() {
    this.modal.destroy()
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }
  open() {
    this.modal.open()
  }
  cancel() {
    this.modal.close()
  }
  submit() {
    this.pending = true
    this.modal.close()

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }

    this.ordersService.create(order).subscribe(
      newOrder => {
        console.warn("заказ был добавлен")
        this.order.clear()
      },
      error => {console.warn(error)},
      () => {
        this.modal.close()
        this.pending = false
      }
    )
  }
  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }
}
