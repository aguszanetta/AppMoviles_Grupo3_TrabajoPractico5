import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ModalController } from '@ionic/angular';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { Toast } from '@capacitor/toast';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  personajes = []

  constructor(private http: HttpClient, private modalCtrl: ModalController, public alertController: AlertController) {}

  async ngOnInit() {
    const existePersonajes = this.getPersonajes();
    if((await existePersonajes).length > 0){ 
    this.personajes = (await existePersonajes);
    } else{
      this.http
      .get<any>("https://rickandmortyapi.com/api/character")
      .subscribe(res => {
        this.personajes = res.results;
        for(let i = 0; i < this.personajes.length; i++){
          Storage.set({
            key: JSON.stringify(this.personajes[i].id),
            value: JSON.stringify(this.personajes[i])
          });
        }
      },
      error => {
        console.log(error);
        defineCustomElements(window);
        Toast.show({text: 'Ocurrió un error en la consulta a la API'});},
      );
    }
  }

  async getPersonajes(){
    const keys = await Storage.keys();
    for(let i = 0; i < keys.keys.length; i++){
      const personaje = Storage.get({key:keys.keys[i].toString()});
      const personajeAux = JSON.parse((await personaje).value);
      this.personajes.push(personajeAux);
    }
    return this.personajes;
  }

  async verDetalle(id){
    const modal = await this.modalCtrl.create({
      component: ModalDetalleComponent,
      componentProps: {id : id}
    });
    await modal.present();
  }

  async eliminar(personaje){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Seguro?',
      message: '¿Estás seguro de eliminar a '+personaje.name+'?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: () => {
            this.personajes.splice(this.personajes.indexOf(personaje), 1);
            Storage.remove({ key: (personaje.id).toString() });
            defineCustomElements(window);
            Toast.show({text: '¡Personaje eliminado exitosamente!'});
          }
        }
      ]
    });
    await alert.present();
  }
}
