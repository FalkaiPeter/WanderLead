import { Component, ChangeDetectionStrategy, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { WLPriceList } from '@wl-shared/list-types';
import { FormControl, NgForm } from '@angular/forms';
import { WLErrorStateMatcher, WLValidators } from '@wl-core/validators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-price-group',
  templateUrl: './price-group.component.html',
  styleUrls: ['./price-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGroupComponent implements AfterViewInit {
  @Input() priceGroups: WLPriceList[] = [];
  @Input() wrapperClass: string = '';
  total = 0;

  floatingPanel: {
    caption: string,
    isOpen: boolean,
    pos: {x: string, y: string},
    group: WLPriceList,
    formControl: FormControl,
    matcher: WLErrorStateMatcher,
  };

  constructor(private changeDetector: ChangeDetectorRef) {
    this.floatingPanel = {
      caption: '',
      isOpen: false,
      pos: {x: '', y: ''},
      group: null,
      formControl: new FormControl('', WLValidators.name),
      matcher: new WLErrorStateMatcher(),
    };

   }
  ngAfterViewInit(): void {
    this.priceGroups.map(group => this.total += group.sum)
  }

  drop(event: CdkDragDrop<WLPriceList>) {
    event.previousContainer === event.container
    ? moveItemInArray(event.container.data.items, event.previousIndex, event.currentIndex)
    : transferArrayItem(
        event.previousContainer.data.items,
        event.container.data.items,
        event.previousIndex,
        event.currentIndex
      );
  }

  openFloatingPanel(event: MouseEvent, panelCaption: string, group?: WLPriceList) {
    this.floatingPanel.pos = this.setFloatingPanelPosition(event);
    this.floatingPanel.caption = panelCaption;
    if (group)
      this.floatingPanel.group = group;
    this.floatingPanel.isOpen = true;
    console.log(event)
  }

  addOrRename() {
    this.floatingPanel.group
    ? this.floatingPanel.group.title = this.floatingPanel.formControl.value
    : this.priceGroups.push(new WLPriceList(this.floatingPanel.formControl.value));
    this.floatingPanel.isOpen = false;
    this.floatingPanel.formControl.reset();
  }

  deleteGroup(index: number) {
    this.floatingPanel.isOpen = false;
    this.total -= this.priceGroups[index].sum;
    return this.priceGroups = [
      ...this.priceGroups.slice(0, index),
      ...this.priceGroups.slice(index + 1)
    ];
  }

  addItemToList(form: NgForm, index: number) {
    if(form.valid) {
      this.priceGroups[index].add({name: form.value.name, price: form.value.price});
      this.total += form.value.price;
      form.resetForm();
    }
  }
  setFloatingPanelPosition(event: MouseEvent): {x: string, y: string} {
    /*az element absolute positionban van,
    a kurzo pozicióból le kell vonni a nav magasságát, mert fixed layout van.
    a nav magassága mobilon(window.width <= 425) 88px, egyébként pedig 66px */
   return {
      x: `${event.clientX}px`,
      y: `${event.clientY - (window.outerWidth <= 425 ? 88 : 64)}px`
    };
  }
}
