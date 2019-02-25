import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'player-create',
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.scss']
})
export class PlayerCreateComponent implements OnInit {

  playerForm: FormGroup;

  constructor(private router: Router, private api: DataService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.playerForm = this.formBuilder.group({
      'name': [null, Validators.compose([Validators.required, Validators.maxLength(80)])],
      'country': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'registration_date': [null, Validators.required],
      'score': [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    const scoreValue = this.playerForm.get('score').value as number;

    if (0 <= scoreValue && scoreValue <= 20) {
      this.playerForm.addControl('level', new FormControl(1, Validators.required));
    } else if (21 <= scoreValue && scoreValue <= 40) {
      this.playerForm.addControl('level', new FormControl(2, Validators.required));
    } else if (41 <= scoreValue && scoreValue <= 60) {
      this.playerForm.addControl('level', new FormControl(3, Validators.required));
    } else if (61 <= scoreValue && scoreValue <= 80) {
      this.playerForm.addControl('level', new FormControl(4, Validators.required));
    } else if (81 <= scoreValue && scoreValue <= 100) {
      this.playerForm.addControl('level', new FormControl(5, Validators.required));
    }

    this.api.postPlayer(form)
      .subscribe(res => {
        this.router.navigate(['/']);
      }, (err) => {
        console.log(err);
      });
  }

}

