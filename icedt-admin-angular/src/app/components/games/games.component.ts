import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MultilingualText } from '../../types/multilingual.types';
import { LanguageService } from '../../services/language.service';
import { MultilingualInputComponent } from '../common/multilingual-input.component';

export interface Game {
  id: number;
  name: string;
  title: MultilingualText;
  description: MultilingualText;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ageGroup: '3-5' | '6-8' | '9-12';
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameCreateDto {
  name: string;
  title: MultilingualText;
  description: MultilingualText;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ageGroup: '3-5' | '6-8' | '9-12';
  imageUrl?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MultilingualInputComponent
  ],
  template: `
    <div class="games-container">
      <div class="header">
        <h2>Manage Games</h2>
        <button mat-raised-button color="primary" (click)="openAddGameDialog()" [disabled]="isLoading">
          + ADD NEW GAME
        </button>
      </div>

      <div class="content">
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading games...</p>
        </div>

        <div *ngIf="error" class="error-container">
          <mat-icon>error</mat-icon>
          <p>{{ error }}</p>
          <button mat-button (click)="loadGames()">Retry</button>
        </div>

        <div *ngIf="!isLoading && !error" class="games-table-container">
          <table mat-table [dataSource]="games" class="games-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let game">{{ game.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Game Name</th>
              <td mat-cell *matCellDef="let game">{{ getDisplayText(game.title) || game.name }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let game">{{ game.category }}</td>
            </ng-container>

            <ng-container matColumnDef="difficulty">
              <th mat-header-cell *matHeaderCellDef>Difficulty</th>
              <td mat-cell *matCellDef="let game">
                <span class="difficulty-badge" [class]="'difficulty-' + game.difficulty.toLowerCase()">
                  {{ game.difficulty }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="ageGroup">
              <th mat-header-cell *matHeaderCellDef>Age Group</th>
              <td mat-cell *matCellDef="let game">{{ game.ageGroup }} years</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let game">
                <span class="status-badge" [class]="game.isActive ? 'active' : 'inactive'">
                  {{ game.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let game">
                <button mat-icon-button (click)="editGame(game)" title="Edit Game">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteGame(game)" title="Delete Game" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button (click)="previewGame(game)" title="Preview Game" color="primary">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Game Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Game' : 'Add New Game' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form class="game-form" (ngSubmit)="saveGame()">
          <app-multilingual-input
            [value]="currentGame.title || { ta: '', en: '', si: '' }"
            [label]="'Game Title'"
            [required]="true"
            (valueChange)="onTitleChange($event)">
          </app-multilingual-input>

          <app-multilingual-input
            [value]="currentGame.description || { ta: '', en: '', si: '' }"
            [label]="'Description'"
            [required]="false"
            (valueChange)="onDescriptionChange($event)">
          </app-multilingual-input>

          <mat-form-field appearance="outline">
            <mat-label>Game Name (Internal)</mat-label>
            <input matInput [(ngModel)]="currentGame.name" name="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="currentGame.category" name="category" required>
              <mat-option value="Educational">Educational</mat-option>
              <mat-option value="Puzzle">Puzzle</mat-option>
              <mat-option value="Memory">Memory</mat-option>
              <mat-option value="Language">Language</mat-option>
              <mat-option value="Math">Math</mat-option>
              <mat-option value="Creative">Creative</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Difficulty</mat-label>
            <mat-select [(ngModel)]="currentGame.difficulty" name="difficulty" required>
              <mat-option value="Easy">Easy</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="Hard">Hard</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Age Group</mat-label>
            <mat-select [(ngModel)]="currentGame.ageGroup" name="ageGroup" required>
              <mat-option value="3-5">3-5 years</mat-option>
              <mat-option value="6-8">6-8 years</mat-option>
              <mat-option value="9-12">9-12 years</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Image URL</mat-label>
            <input matInput [(ngModel)]="currentGame.imageUrl" name="imageUrl">
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()" [disabled]="isSaving">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
              <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
              {{ isEditing ? 'Update' : 'Add' }} Game
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .games-container {
      padding: 0;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px 20px 0 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }

    .content {
      padding: 0 20px 20px 20px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .games-table {
      width: 100%;
      border-collapse: collapse;
    }

    .games-table th, .games-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .games-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .games-table tr:hover {
      background-color: #f9f9f9;
    }

    .difficulty-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .difficulty-easy {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .difficulty-medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .difficulty-hard {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h3 {
      margin: 0;
      color: #333;
    }

    .game-form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .games-table {
        font-size: 14px;
      }

      .games-table th, .games-table td {
        padding: 8px;
      }
    }
  `]
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'difficulty', 'ageGroup', 'status', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;

  currentGame: GameCreateDto = {
    name: '',
    title: { ta: '', en: '', si: '' },
    description: { ta: '', en: '', si: '' },
    category: '',
    difficulty: 'Easy',
    ageGroup: '3-5',
    imageUrl: '',
    isActive: true
  };

  constructor(
    private snackBar: MatSnackBar,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  async loadGames() {
    this.isLoading = true;
    this.error = null;

    try {
      // Simulate API call - replace with actual API service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      this.games = [
        {
          id: 1,
          name: 'tamil-alphabet-game',
          title: { ta: 'தமிழ் எழுத்து விளையாட்டு', en: 'Tamil Alphabet Game', si: 'දෙමළ අකුරු ක්‍රීඩාව' },
          description: { ta: 'தமிழ் எழுத்துகளை கற்றுக்கொள்ளுங்கள்', en: 'Learn Tamil alphabets', si: 'දෙමළ අකුරු ඉගෙන ගන්න' },
          category: 'Educational',
          difficulty: 'Easy',
          ageGroup: '3-5',
          imageUrl: '/assets/images/games/alphabet.jpg',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'word-matching-puzzle',
          title: { ta: 'சொல் பொருத்துதல் புதிர்', en: 'Word Matching Puzzle', si: 'වචන ගැලපීමේ ප්‍රහේලිකාව' },
          description: { ta: 'சொற்களை பொருத்தி புதிர்களை தீர்க்குங்கள்', en: 'Match words to solve puzzles', si: 'ප්‍රහේලිකා විසඳීමට වචන ගැලපීම' },
          category: 'Puzzle',
          difficulty: 'Medium',
          ageGroup: '6-8',
          imageUrl: '/assets/images/games/word-puzzle.jpg',
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          name: 'memory-card-game',
          title: { ta: 'நினைவு அட்டை விளையாட்டு', en: 'Memory Card Game', si: 'මතක කාඩ් ක්‍රීඩාව' },
          description: { ta: 'நினைவாற்றலை வளர்த்துக் கொள்ளுங்கள்', en: 'Improve your memory', si: 'ඔබේ මතකය වැඩිදියුණු කරන්න' },
          category: 'Memory',
          difficulty: 'Hard',
          ageGroup: '9-12',
          imageUrl: '/assets/images/games/memory.jpg',
          isActive: false,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z'
        }
      ];
    } catch (err) {
      console.error('Error loading games:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load games';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(content: MultilingualText | undefined): string {
    if (!content) return '';
    return this.languageService.getText(content);
  }

  onTitleChange(value: MultilingualText) {
    this.currentGame.title = value;
  }

  onDescriptionChange(value: MultilingualText) {
    this.currentGame.description = value;
  }

  openAddGameDialog() {
    this.isEditing = false;
    this.currentGame = {
      name: '',
      title: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      category: '',
      difficulty: 'Easy',
      ageGroup: '3-5',
      imageUrl: '',
      isActive: true
    };
    this.showDialog = true;
  }

  editGame(game: Game) {
    this.isEditing = true;
    this.currentGame = {
      name: game.name,
      title: game.title,
      description: game.description,
      category: game.category,
      difficulty: game.difficulty,
      ageGroup: game.ageGroup,
      imageUrl: game.imageUrl || '',
      isActive: game.isActive
    };
    this.showDialog = true;
  }

  async deleteGame(game: Game) {
    const gameName = this.getDisplayText(game.title) || game.name;
    if (confirm(`Are you sure you want to delete "${gameName}"?`)) {
      try {
        // Simulate API call - replace with actual API service
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.games = this.games.filter(g => g.id !== game.id);
        this.snackBar.open('Game deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting game:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete game',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  previewGame(game: Game) {
    // TODO: Implement game preview functionality
    this.snackBar.open(`Preview for "${this.getDisplayText(game.title) || game.name}" - Coming soon!`, 'Close', { duration: 3000 });
  }

  async saveGame() {
    if (!this.currentGame.name || !this.getDisplayText(this.currentGame.title)) {
      this.snackBar.open('Game name and title are required', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    try {
      // Simulate API call - replace with actual API service
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (this.isEditing) {
        // Find and update existing game
        const index = this.games.findIndex(g => g.name === this.currentGame.name);
        if (index !== -1) {
          this.games[index] = {
            ...this.games[index],
            ...this.currentGame,
            updatedAt: new Date().toISOString()
          };
        }
        this.snackBar.open('Game updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new game
        const newGame: Game = {
          ...this.currentGame,
          id: Math.max(...this.games.map(g => g.id), 0) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.games.push(newGame);
        this.snackBar.open('Game created successfully', 'Close', { duration: 3000 });
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving game:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save game',
        'Close',
        { duration: 5000 }
      );
    } finally {
      this.isSaving = false;
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
    this.currentGame = {
      name: '',
      title: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      category: '',
      difficulty: 'Easy',
      ageGroup: '3-5',
      imageUrl: '',
      isActive: true
    };
  }
}

