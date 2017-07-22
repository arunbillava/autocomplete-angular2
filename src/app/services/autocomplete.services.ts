import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class AutoCompleteService {

    serverUrl = "http://0.0.0.0:3000/api";

    //set headers, add anyother if required
    headers = new Headers({
        'Content-Type': 'application/json',
        //'Authorization': 'token',
    });

    constructor(private http: Http) {
    }
    
    //for get result using google api as dummy api
    getSuggestion(searchdata: string): Observable<any> {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+searchdata;

        return this.http.get(url).map(res => res.json()).catch(err => {
            return Observable.throw(err);
        })
    }
    //incase of post 
     getSuggestions(searchdata: string): Observable<any> {
        //incase of json 
        let data={
            keyword : searchdata,
            limit : 4
        }
        return this.http.post(this.serverUrl, data, { headers: this.headers }).map(res => res.json()).catch(err => {
            return Observable.throw(err);
        })
    }

}