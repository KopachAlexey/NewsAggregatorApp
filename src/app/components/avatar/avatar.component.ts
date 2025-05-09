import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatIconModule, NgStyle],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnInit {
  @Input() name : string = '';
  @Input() imageUrl? : string;
  backgroundColor? : string;

  ngOnInit(): void {
   if(!this.imageUrl) {
    this.generateBackgroundColor();
   }
  }

  getFirstLetter() : string {
    return this.name.charAt(0).toUpperCase() || '?';
  }

  private generateBackgroundColor() : void {
    const hash = Array.from(this.name).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash) % 360;
    this.backgroundColor = `hsl(${hue}, 70%, 45%)`;
  }

}
