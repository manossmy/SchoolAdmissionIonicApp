import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMenuCollapse = true;
  menuList = [
    {
      title: 'Application',
      image: 'document-text-outline',
      link: '/home',
    },
  ];
  constructor(private menuController: MenuController) {

  }
  closeMenu() {
    this.menuController.close();
  }
}

