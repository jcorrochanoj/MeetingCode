import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AuthService } from '../../services/auth.service';
import { Proyecto } from '../../models/proyecto.model';

/**
 * Generated class for the ProyectoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-proyecto',
  templateUrl: 'proyecto.html',
})
export class ProyectoPage {
  proyecto:Proyecto;
  private observable:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbFirebase: FirebaseDbProvider, private auth: AuthService) {
    let key = navParams.get('key');
    this.observable = dbFirebase.afDB.object('proyectos/'+key).valueChanges();
    this.observable.subscribe(x => {this.proyecto = x;});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProyectoPage');
  }

  addAplicante() {
    if(this.auth.authenticated) {
      console.log(this.auth.getEmail());
      if(this.proyecto.aplicantes.indexOf(this.auth.getUid()) == -1) {
        this.proyecto.aplicantes.push(this.auth.getUid());
        this.dbFirebase.actualizaProyecto(this.proyecto);
      } else {
        console.log("Error por pantalla de que ya has aplicado")
      }     
    } else {
      console.log("No autenticado");
    }
  }

  desaplicar() {
    let indice = this.proyecto.aplicantes.indexOf(this.auth.getUid());
    if(indice != -1) {
      this.proyecto.aplicantes.splice(indice,1);
    }
    
    this.dbFirebase.actualizaProyecto(this.proyecto);
  }

  descolaborar() {
    let indice = this.proyecto.colaboradores.indexOf(this.auth.getUid());
    if(indice != -1) {
      this.proyecto.colaboradores.splice(indice,1);
    }
    
    this.dbFirebase.actualizaProyecto(this.proyecto);
  }

  irALogin() {
    this.navCtrl.push("LoginPage");
  }

  irAListaAplicantes(key) {
    this.navCtrl.push("ListaAplicantesPage", {key: key});
  }

}
