import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// MatTypographyModule is not available in Angular Material v19

// Import all activity type components
import { McqActivityComponent } from './activity-types/mcq-activity.component';
import { EquationLearnComponent } from './activity-types/equation-learn.component';
import { MediaSpotlightSingleComponent } from './activity-types/media-spotlight-single.component';
import { FlashcardComponent } from './activity-types/flashcard.component';
import { AudioTextImageSelectionComponent } from './activity-types/audio-text-image-selection.component';
import { CharacterGridComponent } from './activity-types/character-grid.component';
import { WordFinderComponent } from './activity-types/word-finder.component';
import { WordPairMCQComponent } from './activity-types/word-pair-mcq.component';
import { StoryPlayerComponent } from './activity-types/story-player.component';
import { VideoPlayerComponent } from './activity-types/video-player.component';
import { LetterFillComponent } from './activity-types/letter-fill.component';
import { InteractiveImageLearningComponent } from './activity-types/interactive-image-learning.component';
import { TamilVowelsComponent } from './activity-types/tamil-vowels.component';
import { SentenceBuilderComponent } from './activity-types/sentence-builder.component';
import { RiddleActivityComponent } from './activity-types/riddle-activity.component';
import { WordScrambleExerciseComponent } from './activity-types/word-scramble-exercise.component';
import { TrueFalseQuizComponent } from './activity-types/true-false-quiz.component';
import { ImageWordMatchComponent } from './activity-types/image-word-match.component';
import { SoundImageMatchComponent } from './activity-types/sound-image-match.component';
import { PositionalSceneBuilderComponent } from './activity-types/positional-scene-builder.component';
import { SongPlayerComponent } from './activity-types/song-player.component';
import { RecognitionGridComponent } from './activity-types/recognition-grid.component';
import { HighlightComponent } from './activity-types/highlight.component';
import { WordBankCompletionComponent } from './activity-types/word-bank-completion.component';
import { FirstLetterMatchComponent } from './activity-types/first-letter-match.component';
import { MatchingComponent } from './activity-types/matching.component';
import { LetterSpotlightComponent } from './activity-types/letter-spotlight.component';
import { DragDropFillInBlankComponent } from './activity-types/drag-drop-fill-in-blank.component';
import { DropdownCompletionComponent } from './activity-types/dropdown-completion.component';
import { DragDropImageMatchingComponent } from './activity-types/drag-drop-image-matching.component';
import { LetterShapeMatchingComponent } from './activity-types/letter-shape-matching.component';

@Component({
  selector: 'app-activity-renderer',
  imports: [
    CommonModule,
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
  template: `
    <div class="activity-renderer">
      <!-- Flashcard -->
      <app-flashcard *ngIf="activityTypeId === 1" [content]="content"></app-flashcard>
      
      <!-- MediaSpotlightMultiple (case 2) - Not implemented yet -->
      <p *ngIf="activityTypeId === 2" class="not-implemented">
        MediaSpotlightMultiple (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- MediaSpotlightSingle -->
      <app-media-spotlight-single *ngIf="activityTypeId === 3" [content]="content"></app-media-spotlight-single>
      
      <!-- Equation Fill in the Blank -->
      <app-equation-learn *ngIf="activityTypeId === 4" [content]="content"></app-equation-learn>
      
      <!-- ConversationPlayer (case 5) - Not implemented yet -->
      <p *ngIf="activityTypeId === 5" class="not-implemented">
        ConversationPlayer (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- SongPlayer -->
      <app-song-player *ngIf="activityTypeId === 6" [content]="content"></app-song-player>
      
      <!-- RecognitionGrid -->
      <app-recognition-grid *ngIf="activityTypeId === 7" [content]="content"></app-recognition-grid>
      
      <!-- CharacterGrid -->
      <app-character-grid *ngIf="activityTypeId === 8" [content]="content"></app-character-grid>
      
      <!-- WordPairMCQ -->
      <app-word-pair-mcq *ngIf="activityTypeId === 9" [content]="content"></app-word-pair-mcq>
      
      <!-- WordFinder -->
      <app-word-finder *ngIf="activityTypeId === 10" [content]="content"></app-word-finder>
      
      <!-- SceneFinder (case 11) - Not implemented yet -->
      <p *ngIf="activityTypeId === 11" class="not-implemented">
        SceneFinder (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- StoryPlayer -->
      <app-story-player *ngIf="activityTypeId === 12" [content]="content"></app-story-player>
      
      <!-- MultipleChoiceQuestion -->
      <app-mcq-activity *ngIf="activityTypeId === 13" [content]="content"></app-mcq-activity>
      
      <!-- AudioTextImageSelection -->
      <app-audio-text-image-selection *ngIf="activityTypeId === 14" [content]="content"></app-audio-text-image-selection>
      
      <!-- DragDropImageMatching -->
      <app-drag-drop-image-matching *ngIf="activityTypeId === 15" [content]="content"></app-drag-drop-image-matching>
      
      <!-- Video Player -->
      <app-video-player *ngIf="activityTypeId === 16" [content]="content"></app-video-player>
      
      <!-- LetterFill -->
      <app-letter-fill *ngIf="activityTypeId === 17" [content]="content"></app-letter-fill>
      
      <!-- LetterSoundMcq (case 18) - Not implemented yet -->
      <p *ngIf="activityTypeId === 18" class="not-implemented">
        LetterSoundMcq (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Drag and Drop Activity (case 19) - Not implemented yet -->
      <p *ngIf="activityTypeId === 19" class="not-implemented">
        Drag and Drop Activity (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- InteractiveImageLearning -->
      <app-interactive-image-learning *ngIf="activityTypeId === 20" [content]="content"></app-interactive-image-learning>
      
      <!-- Letter Shape Matching -->
      <app-letter-shape-matching *ngIf="activityTypeId === 21" [content]="content"></app-letter-shape-matching>
      
      <!-- Letter Sound MCQ (case 18) - Not implemented yet -->
      <p *ngIf="activityTypeId === 18" class="not-implemented">
        Letter Sound MCQ (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Words Learning (case 27) - Not implemented yet -->
      <p *ngIf="activityTypeId === 27" class="not-implemented">
        Words Learning (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Word Splitter (case 38) - Not implemented yet -->
      <p *ngIf="activityTypeId === 38" class="not-implemented">
        Word Splitter (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Drag Drop Categorization (case 46) - Not implemented yet -->
      <p *ngIf="activityTypeId === 46" class="not-implemented">
        Drag Drop Categorization (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Drag Drop Sentence (case 33) - Not implemented yet -->
      <p *ngIf="activityTypeId === 33" class="not-implemented">
        Drag Drop Sentence (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Drag Drop Text Sort (case 35) - Not implemented yet -->
      <p *ngIf="activityTypeId === 35" class="not-implemented">
        Drag Drop Text Sort (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Multi Drag Drop Fill In Blank (case 36) - Not implemented yet -->
      <p *ngIf="activityTypeId === 36" class="not-implemented">
        Multi Drag Drop Fill In Blank (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Sentence Scramble Exercise (case 25) - Not implemented yet -->
      <p *ngIf="activityTypeId === 25" class="not-implemented">
        Sentence Scramble Exercise (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- WordScrambleExercise -->
      <app-word-scramble-exercise *ngIf="activityTypeId === 22" [content]="content"></app-word-scramble-exercise>
      
      <!-- TamilVowels -->
      <app-tamil-vowels *ngIf="activityTypeId === 23" [content]="content"></app-tamil-vowels>
      
      <!-- EquationLearn -->
      <app-equation-learn *ngIf="activityTypeId === 24" [content]="content"></app-equation-learn>
      
      <!-- SentenceScrambleExercise (case 25) - Not implemented yet -->
      <p *ngIf="activityTypeId === 25" class="not-implemented">
        SentenceScrambleExercise (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- SentenceBuilder -->
      <app-sentence-builder *ngIf="activityTypeId === 26" [content]="content"></app-sentence-builder>
      
      <!-- WordsLearning (case 27) - Not implemented yet -->
      <p *ngIf="activityTypeId === 27" class="not-implemented">
        WordsLearning (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- PronunciationPractice (case 28) - Not implemented yet -->
      <p *ngIf="activityTypeId === 28" class="not-implemented">
        PronunciationPractice (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- RiddleActivity -->
      <app-riddle-activity *ngIf="activityTypeId === 29" [content]="content"></app-riddle-activity>
      
      <!-- DragDropWordMatch (case 30) - Not implemented yet -->
      <p *ngIf="activityTypeId === 30" class="not-implemented">
        DragDropWordMatch (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- ReadingComprehensionMatch (case 31) - Not implemented yet -->
      <p *ngIf="activityTypeId === 31" class="not-implemented">
        ReadingComprehensionMatch (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- DragDropSentence (case 33) - Not implemented yet -->
      <p *ngIf="activityTypeId === 33" class="not-implemented">
        DragDropSentence (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- DragDropFillInBlank -->
      <app-drag-drop-fill-in-blank *ngIf="activityTypeId === 34" [content]="content"></app-drag-drop-fill-in-blank>
      
      <!-- DragDropTextSort (case 35) - Not implemented yet -->
      <p *ngIf="activityTypeId === 35" class="not-implemented">
        DragDropTextSort (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- MultiDragDropFillInBlank (case 36) - Not implemented yet -->
      <p *ngIf="activityTypeId === 36" class="not-implemented">
        MultiDragDropFillInBlank (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- HighlightingActivity (case 37) - Not implemented yet -->
      <p *ngIf="activityTypeId === 37" class="not-implemented">
        HighlightingActivity (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- WordSplitter (case 38) - Not implemented yet -->
      <p *ngIf="activityTypeId === 38" class="not-implemented">
        WordSplitter (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- TrueFalseQuiz -->
      <app-true-false-quiz *ngIf="activityTypeId === 40" [content]="content"></app-true-false-quiz>
      
      <!-- ImageWordMatch (case 41) - Not implemented yet -->
      <p *ngIf="activityTypeId === 41" class="not-implemented">
        ImageWordMatch (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- SoundImageMatch -->
      <app-sound-image-match *ngIf="activityTypeId === 42" [content]="content"></app-sound-image-match>
      
      <!-- SentenceOrderingActivity (case 43) - Not implemented yet -->
      <p *ngIf="activityTypeId === 43" class="not-implemented">
        SentenceOrderingActivity (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- PositionalSceneBuilder -->
      <app-positional-scene-builder *ngIf="activityTypeId === 44" [content]="content"></app-positional-scene-builder>
      
      <!-- ListeningMatchingActivity (case 45) - Not implemented yet -->
      <p *ngIf="activityTypeId === 45" class="not-implemented">
        ListeningMatchingActivity (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- DragDropCategorization (case 46) - Not implemented yet -->
      <p *ngIf="activityTypeId === 46" class="not-implemented">
        DragDropCategorization (ID: {{ activityTypeId }}) is not implemented yet.
      </p>
      
      <!-- Default case for unknown activity types -->
      <p *ngIf="!isKnownActivityType()" class="not-implemented">
        Preview for Activity Type ID #{{ activityTypeId }} is not implemented.
      </p>
    </div>
  `,
  styles: [`
    .activity-renderer {
      width: 100%;
      height: 100%;
    }
    
    .not-implemented {
      padding: 16px;
      color: #666;
      text-align: center;
      font-style: italic;
    }
  `]
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
}
