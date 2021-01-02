import { MovieService } from './../../service/movie.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/shared/service/event-emitter.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private _movie: any = [];
  private _listRecomendation: any =[];
  public showButon: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private movieService: MovieService,
    private routerNavegation: Router,

  ) { }

  ngOnInit() {
    this._movie = [];
    this._listRecomendation = [];
    this.init();
  }

  public init(){
    this.route.params.subscribe( parametros => {
      if (parametros['id']) {
        console.log(parametros.id)
        console.log()
        if(typeof parametros.id != 'undefined'){
          this.getMovieDetail(parametros.id);
          this.getRecommendation(parametros.id);
        }else{
          console.log('informado nao foi incontrado')
        }
      }
    });
  }


  get movie() {
    return this._movie;
  }

  get listRecomendation() {
    return this._listRecomendation;
  }

  public getMovieDetail(id) {
    EventEmitterService.get('showLoader').emit();
    this._movie = [];
    this.movieService.getDetailMovie(id).subscribe((res) =>{
      this._movie = res;
      EventEmitterService.get('hideLoader').emit();
      console.log(this._movie)
    },(error: Error) =>{
      console.log(error);
      EventEmitterService.get('hideLoader').emit();
    })
  }

  public getRecommendation(id){
    EventEmitterService.get('showLoader').emit();
    this._listRecomendation = [];
    this.movieService.getRecommendation(id).subscribe((res) =>{
      const filter = res.results.filter(item => item.poster_path != null )
      this.replaceArray(filter)
      EventEmitterService.get('hideLoader').emit();
    },(error: Error) =>{
      console.log(error);
      EventEmitterService.get('hideLoader').emit();
    })
  }

  public replaceArray(result) {
  let corte = 10;

  for (var i = 0; i < result.length; i = i + corte) {
    this._listRecomendation.push(result.slice(i, i + corte));
  }
  console.log(this._listRecomendation);
  }

  public redirect(aux) {
    this.routerNavegation.navigate([`/movie/detalhe/${aux}`])
  }

  public scrolToElement() {
    console.log('entrou no redirect')
    document.querySelector('#home').scrollIntoView({block: 'end',behavior: 'smooth'});
  }


  @HostListener('window:scroll', [])
 public  isScrollUpDown() {
    const scrolTop = window.scrollY;
    if( scrolTop > 280) {
      this.showButon = true;
     } else {
      this.showButon = false;
     }
  }
}
