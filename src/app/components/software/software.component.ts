import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { EangElement } from '@eamode/eang';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  tabActivate$$ = new Subject<EangElement>();

  example = {
    name: '',
    isHidden: true,
    children: [
      {
        name: 'Supplies',
        icon: 'ea-edit',
        iconStyle: 'ea-negative',
        children: [
          {
            name: 'Inventory',
            icon: 'ea-bookmark',
            iconStyle: 'ea-negative'
          },
        ]
      },
      {
        name: 'Orders',
        icon: 'ea-folder-plus',
        iconStyle: 'ea-negative'
      },
      {
        name: 'Inventory',
        icon: 'ea-database',
        iconStyle: 'ea-negative'
      },
      {
        name: 'Vendors',
        icon: 'ea-download',
        iconStyle: 'ea-negative'
      }
    ]
  };
  constructor() {}

  ngOnInit() {}
}
