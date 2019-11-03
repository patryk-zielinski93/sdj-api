import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'sdj-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  @Output()
  navigateToMostPlayed = new EventEmitter<void>();
  @Output()
  navigateToRadio = new EventEmitter<void>();
  @Output()
  toggleMenu = new EventEmitter<void>();

  onOpenMenu(): void {
    this.toggleMenu.emit();
  }

  onNavigateToRadio() {
    this.navigateToRadio.emit();
  }

  onNavigateToMostPlated(): void {
    this.navigateToMostPlayed.emit();
  }
}
