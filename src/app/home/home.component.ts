import { Component, OnInit, ElementRef } from '@angular/core';
import { Subject } from "rxjs";
import { AutoCompleteService } from "../services/autocomplete.services";
import { isNullOrUndefined } from "util";


@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
  providers: [AutoCompleteService]
})
export class HomeComponent implements OnInit {

  searchTerm = new Subject<any>();
  posts: any[] = [];
  autocompleteBox = { hide: true };
  keyword: string = "";
  selectedPost: any;
  constructor(private autoCompleteService: AutoCompleteService, private elRef: ElementRef) {
    this.searchTerm.debounceTime(400).distinctUntilChanged().subscribe(searchTerm => {
      console.log(searchTerm);
      this.selectedPost = null;
      this.autoCompleteService.getSuggestion(searchTerm).subscribe(response => {

        this.posts = response.results;

        this.autocompleteBox.hide = false;

      }, err => {

        console.log(err);

      });
    });
  }
  ngAfterViewInit() {
  }

  ngOnInit() {

  }
  arrowkeyLocation = 0;

  onKeyup(event: any, searchText: string) {




    if (event.keyCode === 40 && this.arrowkeyLocation < this.posts.length - 1) {
      // Arrow Down
      this.arrowkeyLocation++;
    } else if (event.keyCode === 38 && this.arrowkeyLocation > 0) {
      // Arrow Up
      this.arrowkeyLocation--;
    }









    console.log("code is" + event.keyCode)

    if (searchText !== "") {
      this.searchTerm.next(searchText);
      this.selectedPost = null;
    }
    else {
      this.autocompleteBox.hide = true;
    }

  }

  settitle(post: any) {
    this.keyword = post.formatted_address;
    this.selectedPost = post;
    this.autocompleteBox.hide = true;
  }
}