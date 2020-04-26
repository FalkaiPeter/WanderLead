import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @ViewChild('map', {static: true}) mapRef: ElementRef;
  @ViewChild('search', {static: true}) searchRef: ElementRef;
  map: google.maps.Map;
  tmpMarker: google.maps.places.PlaceResult;


  constructor() { }
  ngOnInit(): void {
  }



}
