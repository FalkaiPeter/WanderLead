import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { WLPLaceList } from '@wl-core/models/list-types';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { WLValidators, WLErrorStateMatcher } from '@wl-core/validators';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-place-group',
  templateUrl: './place-group.component.html',
  styleUrls: ['./place-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceGroupComponent implements OnInit {
  @Input() editable: boolean = false;
  @Input() placeGroups: WLPLaceList[] = [];
  @Input() wrapperClass = '';
  @Input() map: google.maps.Map;
  floatingPanel: {
    isOpen: boolean;
    caption: string;
    pos: {x: string, y: string},
    group: WLPLaceList
    formControl: FormControl,
    matcher: ErrorStateMatcher,
    initColor: string,
    type: string,
  };


  nameFormControl = new FormControl ('', [
    Validators.required,
    Validators.maxLength(20),
    Validators.minLength(2)
  ]);
  matcher = new MyErrorStateMatcher();


  constructor(public changeDetector: ChangeDetectorRef) {
    this.floatingPanel = {
      isOpen: false,
      caption: '',
      pos: {x: '', y: ''},
      group: null,
      formControl: new FormControl('', WLValidators.name),
      matcher: new WLErrorStateMatcher(),
      initColor: '',
      type: '',
    };
  }

  ngOnInit() {
    if (this.map === undefined) {
      throw new Error('map is required in places group component');
    }
  }

  drop(event: CdkDragDrop<WLPLaceList>) {
    event.previousContainer === event.container ?
      moveItemInArray(event.container.data.items, event.previousIndex, event.currentIndex) :
      transferArrayItem(
        event.previousContainer.data.items,
        event.container.data.items,
        event.previousIndex,
        event.currentIndex
      );
    event.container.data.items[event.currentIndex].marker.setIcon(event.container.data.icon(event.container.data.color));
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.container.data.items.length; i++) {
      event.container.data.items[i].marker.setLabel((i + 1).toString());
    }
    for (let i = 0; i < event.previousContainer.data.items.length; i++) {
      event.previousContainer.data.items[i].marker.setLabel((i + 1).toString());
    }

    this.changeDetector.detectChanges();
    event.container.data.renderRoute(false);
    event.previousContainer.data.renderRoute(false);
  }

  openFloatingPanel(event: MouseEvent, panelCaption: string, type: string, group?: WLPLaceList) {
    this.floatingPanel.caption = panelCaption;
    this.floatingPanel.pos = this.setFloatingElementPosition(event);
    if (group) {
      this.floatingPanel.group = group;
      this.floatingPanel.initColor = group.color;
    }
    this.floatingPanel.type = type;
    this.floatingPanel.isOpen = true;
  }

  addOrRename() {
    this.floatingPanel.group
    ? this.floatingPanel.group.title = this.floatingPanel.formControl.value
    : this.placeGroups.push(new WLPLaceList(
      this.floatingPanel.formControl.value,
      new google.maps.DistanceMatrixService(),
      new google.maps.DirectionsRenderer({map: this.map, suppressMarkers: true}),
      new google.maps.DirectionsService(),
      ));
    this.floatingPanel.isOpen = false;
    this.floatingPanel.formControl.reset();
    this.floatingPanel.group = null;
  }

  setFloatingElementPosition(event: MouseEvent): {x: string, y: string} {
    /*az element absolute positionban van,
    a kurzo pozicióból le kell vonni a nav magasságát, mert fixed layout van.
    a nav magassága mobilon(window.width <= 425) 88px, egyébként pedig 66px */
   return {
      x: `${event.clientX}px`,
      y: `${event.clientY - (window.outerWidth <= 425 ? 88 : 64)}px`
    };
  }

  changeGroupColor(event) {
    this.floatingPanel.group.color = event.color.hex;
    this.floatingPanel.group.items
    .map(item => item.marker)
    .forEach(marker => marker.setIcon(this.floatingPanel.group.icon(event.color.hex)));
  }

  cancelColor() {
    this.floatingPanel.group.color = this.floatingPanel.initColor;
    this.floatingPanel.isOpen = false;
  }

  deleteGroup(index: number) {
    this.placeGroups[index].items.forEach(element => {
      element.place = null,
      element.marker.setMap(null);
    });
    this.placeGroups[index].directionsRenderer.setMap(null)
    this.placeGroups = [
      ...this.placeGroups.slice(0, index),
      ...this.placeGroups.slice(index + 1)
    ];
    this.floatingPanel.group = null;
    this.changeDetector.detectChanges();
  }

  trackby = (index: number, item) => item;

}
