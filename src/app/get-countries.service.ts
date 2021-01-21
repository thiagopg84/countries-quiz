import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from './country.model';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCountriesService {
  allCountries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);
  isLodaded: boolean = false;

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get('https://restcountries.eu/rest/v2/all').pipe(
      map((response: any[]) => {
        let countriesResponse: Country[] = []
        response.forEach(e => {
          countriesResponse.push(new Country(e['name'], e['capital'], e['flag']))
        })
        this.allCountries.next(countriesResponse);
        // console.log(this.allCountries.value);
      })
    );
  }
}
