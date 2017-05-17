import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { Chart } from './chart';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ChartService {
    constructor(private http:Http){}

    getData(){
        const headers = new Headers();
        // const content = { file };
        // headers.append('Content-Type','application/json;charset=utf-8');
        // return this.http
        //     .post('http://localhost:3000/csv',JSON.stringify(content),headers)
        //     .map((response : Response) =>  response.json()); 
    }
}