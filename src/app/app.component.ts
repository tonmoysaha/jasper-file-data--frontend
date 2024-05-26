import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ApexServiceService} from './apex-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'apex-view';
  documentName = '';
  file: any;
  displayedColumns: string[] = ['id', 'trnumber', 'knitCardNumber', 'requisitionQuantity', 'knitCardQuantity', 'knitCardBalance'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  constructor(private service: ApexServiceService) {
  }

  ngOnInit(): void {
    this.loadData();
  }


  onFileSelected(event: EventTarget | null): void {
    // @ts-ignore
    this.file = (event as HTMLInputElement).files[0];
    this.documentName = this.file?.name ? this.file?.name : 'Sample';
    // @ts-ignore
    const label = event?.nextElementSibling;
    label.innerText = this.documentName;
  }

  upload($event: MouseEvent): void {
    $event.preventDefault();
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.service.uplodad(this.file).subscribe(v => {
        this.loadData();
      });
    }
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: KeyboardEvent): void {
    if (filterValue) {
      let inputElement = (filterValue.target as HTMLInputElement).value;
      inputElement = inputElement.trim(); // Remove whitespace
      inputElement = inputElement.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = inputElement;
    }

  }


  downloadFile(): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    this.service.getFile().subscribe(v => {
      const blob = new Blob([v],
        {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'sample.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  private loadData(): void {
    this.service.get().subscribe(v => {
      this.dataSource.data = v;
    });
  }
}

export interface PeriodicElement {
  id: number;
  knitCardNumber: number;
  knitCardQuantity: number;
  requisitionQuantity: number;
  knitCardBalance: number;
  trnumber: number;
}
