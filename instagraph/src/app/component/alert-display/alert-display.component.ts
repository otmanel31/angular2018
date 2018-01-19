import { Component, OnInit } from '@angular/core';
import { AlertManagerService } from '../../services/alert-manager.service';

@Component({
  selector: 'app-alert-display',
  templateUrl: './alert-display.component.html',
  styleUrls: ['./alert-display.component.css']
})
export class AlertDisplayComponent implements OnInit {

  public alerts: any[] = [];

  constructor(private alertManager: AlertManagerService) { }

  ngOnInit() {
    this.alertManager.alertAsObservable().subscribe(alert =>{
      this.alerts.push({
        type : alert[0],
        message: alert[1],
        timeout: 5000
      });
    })
  }

  removeAlert(evt):void{
    let pos = this.alerts.findIndex(a => a==evt);
    if (pos >= 0){
      console.log('remove alerts');
      this.alerts.splice(pos, 1);
    }

  }
}
