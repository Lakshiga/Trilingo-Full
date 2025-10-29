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
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
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