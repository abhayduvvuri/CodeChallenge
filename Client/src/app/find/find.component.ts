import { Component, OnInit } from '@angular/core';
import { HeroService } from '../common/services/hero.service';
import { HeroModel } from '../common/services/hero.model';

import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
  constructor(private heroService: HeroService,
    private route:ActivatedRoute) { }

  public hero = new HeroModel();
  public heroId = "";

  ngOnInit(): void {
    this.heroId = this.route.snapshot.paramMap.get('id');
    console.log(this.heroId);
    this.getHero(this.heroId);
  }

  getHero(id: string) : void {
    this.heroService.getHero(this.heroId).subscribe((res) => {
      console.log(res);
      this.hero = res.hero;
    });
  }

}
