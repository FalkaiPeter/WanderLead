import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent{
  searchConfig = {
    ...environment.algolia,
    indexName: 'users_search',
  };

  constructor() { }



}
