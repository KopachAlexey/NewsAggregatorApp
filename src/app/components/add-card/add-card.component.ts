import { AddCard } from './../../models/add-card';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})
export class AddCardComponent {
  @Input() addCard?: AddCard
}
