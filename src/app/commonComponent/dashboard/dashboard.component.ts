import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { LoginService } from '../../services/login.service';
;


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private _dashboardData: LoginService) { }

  ngOnInit(): void {
    this.getDashboardData();
  }

  dashboardDetails: any
  getDashboardData() {
    this._dashboardData.getDashboardDetails().subscribe((data: any) => {
      if (data) {
        this.dashboardDetails = data.data;
      }
    })
  }

}
