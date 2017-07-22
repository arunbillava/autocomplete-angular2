import { Component } from '@angular/core';
import { Subject } from "rxjs";
import { AutoCompleteService } from "../services/autocomplete.services";

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
  providers: [AutoCompleteService]
})
export class HomeComponent {

  searchTerm = new Subject<any>();
  posts: any[] = [];
  autocompleteBox = { hide: true };
  keyword: string = "";
  selectedPost: any;
  isActive: any;
  constructor(private autoCompleteService: AutoCompleteService) {
    //to reduce flickering add 400 debounce time
    this.searchTerm.debounceTime(400).distinctUntilChanged().subscribe(searchTerm => {
      console.log(searchTerm);
      this.selectedPost = null;
      //call api
      this.autoCompleteService.getSuggestion(searchTerm).subscribe(response => {
        this.posts = response.results;
        this.autocompleteBox.hide = false;
        //if posts are there then activate first on dropdown
        if (this.posts != undefined && this.posts.length > 0) {
          this.isActive = this.posts[0];
        }

      }, err => {
        console.log(err);
      });
    });
  }
  //current activated from dropdown
  private active(value: any): boolean {
    return this.isActive === value;
  }
  //arrow down 
  public prevActiveMatch() {
    let index = this.posts.indexOf(this.isActive);
    this.isActive = this.posts[index - 1 < 0 ? this.posts.length - 1 : index - 1];
    this.keyword = this.isActive.formatted_address;
  }
  //arrow up
  public nextActiveMatch() {
    let index = this.posts.indexOf(this.isActive);
    this.isActive = this.posts[index + 1 > this.posts.length - 1 ? 0 : index + 1];
    this.keyword = this.isActive.formatted_address;
  }

  //on key up
  onKeyup(event: any, searchText: string) {

    if (event.keyCode === 40) {
      // Arrow Down
      this.nextActiveMatch();
      return;
    } else if (event.keyCode === 38) {
      // Arrow Up
      this.nextActiveMatch();
      return;
    }
    // enter
    if (event.keyCode === 13) {
      this.onSelect(this.isActive);
      return;
    }
    //if text entered
    if (searchText !== "") {
      this.searchTerm.next(searchText);
      this.selectedPost = null;
    }
    else {
      //if empty hide dropdown and empty result
      this.autocompleteBox.hide = true;
      console.log("empty..")
      this.posts = [];
    }

  }
  //on select
  onSelect(post: any) {
    this.keyword = post.formatted_address;
    this.selectedPost = post;
    this.autocompleteBox.hide = true;
  }
}