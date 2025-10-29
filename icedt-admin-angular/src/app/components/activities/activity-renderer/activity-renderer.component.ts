import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../services/language.service';

// Import all activity type components
import { McqActivityComponent } from '../activity-types/mcq-activity/mcq-activity.component';
import { EquationLearnComponent } from '../activity-types/equation-learn/equation-learn.component';
import { MediaSpotlightSingleComponent } from '../activity-types/media-spotlight-single/media-spotlight-single.component';
import { FlashcardComponent } from '../activity-types/flashcard/flashcard.component';
import { AudioTextImageSelectionComponent } from '../activity-types/audio-text-image-selection/audio-text-image-selection.component';
import { CharacterGridComponent } from '../activity-types/character-grid/character-grid.component';
import { WordFinderComponent } from '../activity-types/word-finder/word-finder.component';
import { WordPairMCQComponent } from '../activity-types/word-pair-mcq/word-pair-mcq.component';
import { StoryPlayerComponent } from '../activity-types/story-player/story-player.component';
import { VideoPlayerComponent } from '../activity-types/video-player/video-player.component';
import { LetterFillComponent } from '../activity-types/letter-fill/letter-fill.component';
import { InteractiveImageLearningComponent } from '../activity-types/interactive-image-learning/interactive-image-learning.component';
import { TamilVowelsComponent } from '../activity-types/tamil-vowels/tamil-vowels.component';
import { SentenceBuilderComponent } from '../activity-types/sentence-builder/sentence-builder.component';
import { RiddleActivityComponent } from '../activity-types/riddle-activity/riddle-activity.component';
import { WordScrambleExerciseComponent } from '../activity-types/word-scramble-exercise/word-scramble-exercise.component';
import { TrueFalseQuizComponent } from '../activity-types/true-false-quiz/true-false-quiz.component';
import { ImageWordMatchComponent } from '../activity-types/image-word-match/image-word-match.component';
import { SoundImageMatchComponent } from '../activity-types/sound-image-match/sound-image-match.component';
import { PositionalSceneBuilderComponent } from '../activity-types/positional-scene-builder/positional-scene-builder.component';
import { SongPlayerComponent } from '../activity-types/song-player/song-player.component';
import { RecognitionGridComponent } from '../activity-types/recognition-grid/recognition-grid.component';
import { HighlightComponent } from '../activity-types/highlight/highlight.component';
import { WordBankCompletionComponent } from '../activity-types/word-bank-completion/word-bank-completion.component';
import { FirstLetterMatchComponent } from '../activity-types/first-letter-match/first-letter-match.component';
import { MatchingComponent } from '../activity-types/matching/matching.component';
import { LetterSpotlightComponent } from '../activity-types/letter-spotlight/letter-spotlight.component';
import { DragDropFillInBlankComponent } from '../activity-types/drag-drop-fill-in-blank/drag-drop-fill-in-blank.component';
import { DropdownCompletionComponent } from '../activity-types/dropdown-completion/dropdown-completion.component';
import { DragDropImageMatchingComponent } from '../activity-types/drag-drop-image-matching/drag-drop-image-matching.component';
import { LetterShapeMatchingComponent } from '../activity-types/letter-shape-matching/letter-shape-matching.component';

@Component({
  selector: 'app-activity-renderer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    McqActivityComponent,
    EquationLearnComponent,
    MediaSpotlightSingleComponent,
    FlashcardComponent,
    AudioTextImageSelectionComponent,
    CharacterGridComponent,
    WordFinderComponent,
    WordPairMCQComponent,
    StoryPlayerComponent,
    VideoPlayerComponent,
    LetterFillComponent,
    InteractiveImageLearningComponent,
    TamilVowelsComponent,
    SentenceBuilderComponent,
    RiddleActivityComponent,
    WordScrambleExerciseComponent,
    TrueFalseQuizComponent,
    ImageWordMatchComponent,
    SoundImageMatchComponent,
    PositionalSceneBuilderComponent,
    SongPlayerComponent,
    RecognitionGridComponent,
    HighlightComponent,
    WordBankCompletionComponent,
    FirstLetterMatchComponent,
    MatchingComponent,
    LetterSpotlightComponent,
    DragDropFillInBlankComponent,
    DropdownCompletionComponent,
    DragDropImageMatchingComponent,
    LetterShapeMatchingComponent
  ],
  templateUrl: './activity-renderer.component.html',
  styleUrls: ['./activity-renderer.component.css']
})
export class ActivityRendererComponent {
  @Input() activityTypeId!: number;
  @Input() content: any;

  isKnownActivityType(): boolean {
    const knownTypes = [
      1, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 29, 33, 34, 35, 36, 37, 38, 40, 41, 42, 44, 46
    ];
    return knownTypes.includes(this.activityTypeId);
  }

  constructor(private languageService: LanguageService) {}

  text(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if ('ta' in value || 'en' in value || 'si' in value) {
        return this.languageService.getText(value as any);
      }
    }
    return JSON.stringify(value);
  }

  image(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return this.languageService.getImage(value as any);
    }
    return undefined;
  }

  audio(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return this.languageService.getAudio(value as any);
    }
    return undefined;
  }
}