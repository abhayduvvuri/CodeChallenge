import { Component, OnInit } from '@angular/core';
import { HeroService } from '../common/services/hero.service';

import {MatTableModule, MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public heroes = [];
  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe((res: any) => {

          this.heroes = res.heroes;


        });
  }
}
