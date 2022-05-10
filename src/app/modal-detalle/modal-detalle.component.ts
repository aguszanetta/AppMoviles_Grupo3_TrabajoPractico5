import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { Storage} from '@capacitor/storage';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.scss'],
})
export class ModalDetalleComponent implements OnInit{
  @Input() id: string;
  constructor(private http: HttpClient, private modalCtrl: ModalController) { }
  
  personaje = [];
  async ngOnInit() {
    const detalle = Storage.get({key:this.id.toString()});
    this.personaje = JSON.parse((await detalle).value);
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

}
