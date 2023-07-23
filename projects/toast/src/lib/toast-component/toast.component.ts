import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastModel } from '../toast.model';
import { ToastPosition, ToastService } from '../toast.service';

@Component({
  selector: 'lib-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {

  toastsRecord = new Map<number, ToastModel>();
  toasts: ToastModel[] = [];
  position: ToastPosition = "top-right";

  private subscriptions: Subscription[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.position = this.toastService.position;

    let subscription = this.toastService.toastCreation$.subscribe(
      (toast: ToastModel) => {
        if (toast.id) {
          this.toastsRecord.set(toast.id, toast);
          this.toasts = [...this.toastsRecord.values()];
        }
      }
    )

    this.subscriptions.push(subscription);

    subscription = this.toastService.toastDeletion$.subscribe(
      (id: number) => this.close(id)
    );

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  close(id: number): void {
    this.toastsRecord.get(id)!.visible = false;
    this.toastsRecord.delete(id);
    this.toasts = [...this.toastsRecord.values()];
  }

}
