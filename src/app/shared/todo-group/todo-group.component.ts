import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { WLTodoList } from '@wl-shared/list-types';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { WLValidators, WLErrorStateMatcher } from '@wl-core/validators';

@Component({
  selector: 'app-todo-group',
  templateUrl: './todo-group.component.html',
  styleUrls: ['./todo-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoGroupComponent implements OnInit {
  @Input() todoGroups: WLTodoList[] = [];
  @Input() wrapperClass: string = '';

  floatingPanel: {
    caption: string,
    pos: {x: string, y: string},
    isOpen: boolean,
    group: WLTodoList,
    formControl: FormControl,
    matcher: WLErrorStateMatcher,
  };

  constructor() {
    this.floatingPanel = {
      caption: '',
      pos: {x: '', y: ''},
      isOpen: false,
      group: null,
      formControl: new FormControl('', WLValidators.name),
      matcher: new WLErrorStateMatcher(),
    };
   }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<WLTodoList>) {
    event.previousContainer === event.container ?
      moveItemInArray(event.container.data.items, event.previousIndex, event.currentIndex) :
      transferArrayItem(
        event.previousContainer.data.items,
        event.container.data.items,
        event.previousIndex,
        event.currentIndex
      );
  }

  openFloatingPanel(event: MouseEvent, panelCaption: string, group?: WLTodoList) {
    this.floatingPanel.pos = this.setFloatingPanelPosition(event);
    this.floatingPanel.caption = panelCaption;
    if (group)
      this.floatingPanel.group = group;
    this.floatingPanel.isOpen = true;
  }

  addOrRename() {
    this.floatingPanel.group
    ? this.floatingPanel.group.title = this.floatingPanel.formControl.value
    : this.todoGroups.push(new WLTodoList(this.floatingPanel.formControl.value));
    this.floatingPanel.isOpen = false;
    this.floatingPanel.formControl.reset();
  }

  deleteGroup(index: number) {
    return this.todoGroups = [
      ...this.todoGroups.slice(0, index),
      ...this.todoGroups.slice(index + 1)
    ];
  }

  addItemToList(form: NgForm, index: number) {
    if ( form.valid) {
      this.todoGroups[index].add({name: form.value.todo, done: false});
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
