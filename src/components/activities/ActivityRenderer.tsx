import React from 'react';
import { Typography } from '@mui/material';

// --- Step 1: Import ALL activity components and their content types ---
import MCQActivity from './activity-types/MCQActivity';
import EquationFillInTheBlank, { Equation } from './activity-types/Equations';
import MediaSpotlightSingle, { MediaSpotlightSingleContent } from './activity-types/MediaSpotlightSingle';
import Flashcard, { FlashcardContent } from './activity-types/Flashcard';
import MediaSpotlightMultiple, { MediaSpotlightMultipleContent } from './activity-types/MediaSpotlightMultiple';

import {
    MCQContent,
    DragDropImageMatchingContent,
    AudioTextImageSelectionContent,
} from '../../types/activityContentTypes';
import ConversationPlayer, { ConversationContent } from './activity-types/ConversationPlayer';
import SongPlayer, { SongContent } from './activity-types/SongPlayer';
import RecognitionGrid, { RecognitionGridContent } from './activity-types/RecognitionGrid';
import CharacterGrid, { CharacterGridContent } from './activity-types/CharacterGrid';
import WordFinder, { WordFinderSingleChallenge } from './activity-types/WordFinder';
import WordPairMCQ, { WordPairMCQContent} from './activity-types/WordPairMCQ';
import SceneFinder, { SceneFinderContent } from './activity-types/SceneFinder';
import StoryPlayer, { StoryContent } from './activity-types/StoryPlayer';
import VideoPlayerActivity from './activity-types/VideoPlayer';
import LetterFillActivity, { LetterFillContent } from './activity-types/LetterFill';
import DragAndDropActivity, { DragDropContent } from './activity-types/DragandDropActivity';
import LetterShapeActivity, { LetterShapeContent } from './activity-types/LetterShapeMatching';
import WordScrambleActivity, { WordScrambleContent } from './activity-types/WordScrambleExercise';
import SentenceScrambleActivity, { SentenceScrambleContent } from './activity-types/SentenceScrambleExercise';

import DragDropImageMatching from './activity-types/DragDropImageMatching';
import InteractiveImageLearning, { InteractiveImageLearningContent } from './activity-types/InteractiveImageLearning';
import LettersDisplay, { LettersDisplayContent } from './activity-types/TamilVowels';
import EquationLern, { EquationLernContent } from './activity-types/EquationLern';
import SentenceBuilder, { SentenceBuilderContent } from './activity-types/SentenceBuilder';
import PronunciationPractice, { PronunciationPracticeContent } from './activity-types/PronunciationPractice';
import RiddleActivity, { RiddleContent } from './activity-types/RiddleActivity';
import DragDropWordMatch, { DragDropWordMatchContent } from './activity-types/DragDropWordMatch';
import ReadingComprehensionMatch, { ReadingComprehensionContent } from './activity-types/ReadingComprehensionMatch';
import DragDropFillInBlank, { DragDropFillInBlankContent } from './activity-types/DragDropFillInBlank';
import DragDropTextSort, { DragDropTextSortContent } from './activity-types/DragDropTextSort';
import MultiDragDropFillInBlank, { MultiDragDropFillInBlankContent } from './activity-types/MultiDragDropFillInBlank';
import LetterSoundMcq, { LetterSoundMcqContent } from './activity-types/LetterSoundMcq';
import WordsLearning, { WordsLearningContent } from './activity-types/WordsLearning';
import DragDropSentence, { FillInTheBlanksContent } from './activity-types/DragDropSentence';
import HighlightActivity, { HighlightContent } from './activity-types/Highlight';
import AudioTextImageSelection from './activity-types/AudioTextImageSelection';
import WordSplitter, { WordSplitterContent } from './activity-types/WordSplitter';
import TrueFalseQuiz, { TrueFalseQuizContent } from './activity-types/TrueFalseQuiz';
import ImageWordMatch, { ImageWordMatchContent } from './activity-types/ImageWordMatch';
import SoundImageMatch, { SoundImageMatchContent } from './activity-types/SoundImageMatch';
import PositionalSceneBuilder, { PositionalSceneBuilderContent } from './activity-types/PositionalSceneBuilder';
import SentenceOrderingActivity, { SentenceOrderingContent } from './activity-types/SentenceOrderingActivity';
import ListeningMatchingActivity, { ListeningMatchingContent } from './activity-types/ListeningMatchingDragandDrop';
import DragDropCategorization, { CategorizationContent } from './activity-types/DragDropCategorization';


interface ActivityRendererProps {
    activityTypeId: number;
    content: any; // The already-parsed JSON object or array
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activityTypeId, content }) => {
    // --- Step 3: Use the detailed, working switch statement logic ---
    switch (activityTypeId) {
        case 1:
            return <Flashcard content={content as FlashcardContent} />;
        case 2: // VocabularySpotlightMultiple 
            return <MediaSpotlightMultiple content={content as MediaSpotlightMultipleContent} />;
        case 3: // VocabularySpotlightSingle
            return <MediaSpotlightSingle content={content as MediaSpotlightSingleContent} />;
        case 4: // Letter Spotlight
            return <EquationFillInTheBlank content={content as Equation} />;
        case 5: // ConversationPlayer
            return <ConversationPlayer content={content as ConversationContent} />;
        case 6: // SongPlayer
            return <SongPlayer content={content as SongContent} />;
        case 7: // RecognitionGrid
            return <RecognitionGrid content={content as RecognitionGridContent} />;
        case 8: // CharacterGrid
            return <CharacterGrid content={content as CharacterGridContent} />;
        case 9: // WordPairMCQ
            return <WordPairMCQ content={content as WordPairMCQContent} />;
        case 10: // WordFinder
            return <WordFinder content={content as WordFinderSingleChallenge} />;
        case 11: // SceneFinder
            return <SceneFinder content={content as SceneFinderContent} />;
        case 12: // StoryPlayer
            return <StoryPlayer content={content as StoryContent} />;
        case 13: // MultipleChoiceQuestion
            return <MCQActivity content={content as MCQContent} />;
        case 14: // Listen & Match
            return <AudioTextImageSelection content={content as AudioTextImageSelectionContent} />;
        case 15: // DragDropImageMatching
            return <DragDropImageMatching content={content as DragDropImageMatchingContent} />;
        case 16: // Video Player
            return <VideoPlayerActivity content={content as any} />;
        case 17: // LetterFill
            return <LetterFillActivity content={content as LetterFillContent} />;
        case 18: //LetterSoundMcq
            return <LetterSoundMcq content={content as LetterSoundMcqContent} />;
        case 19: // Drag and Drop Activity 
            return <DragAndDropActivity content={content as DragDropContent} />;
        case 20: // InteractiveImageLearning
            return <InteractiveImageLearning content={content as InteractiveImageLearningContent} />;
        case 21: // Letter Shape Matching
            return <LetterShapeActivity content={content as LetterShapeContent} />;
        case 22: // wordScrambleExercise
            return <WordScrambleActivity content={content as WordScrambleContent} />;
        case 23: // LettersDisplay
            return <LettersDisplay content={content as LettersDisplayContent} />;
        case 24: // EquationLern
            return <EquationLern content={content as EquationLernContent} />;
        case 25: // sentenceScrambleExercise
            return <SentenceScrambleActivity content={content as SentenceScrambleContent} />;
        case 26: // SentenceBuilder
            return <SentenceBuilder content={content as SentenceBuilderContent} />;
        case 27: // WordsLearning
            return <WordsLearning content={content as WordsLearningContent} />;
        case 28: // PronunciationPractice
            return <PronunciationPractice content={content as PronunciationPracticeContent} />;
        case 29: // RiddleActivity
            return <RiddleActivity content={content as RiddleContent} />;
        case 30: // DragDropWordMatch
            return <DragDropWordMatch content={content as DragDropWordMatchContent} />;
        case 31: // ReadingComprehensionMatch
            return <ReadingComprehensionMatch content={content as ReadingComprehensionContent} />;
        case 34: // DragDropFillInBlank
            return <DragDropFillInBlank content={content as DragDropFillInBlankContent} />;
        case 33: // DragDropSentence
            return <DragDropSentence content={content as FillInTheBlanksContent} />;
        case 35: // DragDropTextSort
            return <DragDropTextSort content={content as DragDropTextSortContent} />;
        case 36: // MultiDragDropFillInBlank
            return <MultiDragDropFillInBlank content={content as MultiDragDropFillInBlankContent} />;
        case 37: // 'HighlightingActivity'
            return <HighlightActivity content={content as HighlightContent} />;
        case 38: // WordSplitter
            return <WordSplitter content={content as WordSplitterContent} />;
        case 40: // TrueFalseQuiz
            return <TrueFalseQuiz content={content as TrueFalseQuizContent} />;
        case 41: // ImageWordMatch
            return <ImageWordMatch content={content as ImageWordMatchContent} />;
        case 42: // SoundImageMatch
            return <SoundImageMatch content={content as SoundImageMatchContent} />;
        case 43: // 'SentenceOrderingActivity'
            return <SentenceOrderingActivity content={content as SentenceOrderingContent} />;
        case 44: // PositionalSceneBuilder
            return <PositionalSceneBuilder content={content as PositionalSceneBuilderContent} />;
        case 45: // 'ListeningMatchingActivity'
            return <ListeningMatchingActivity content={content as ListeningMatchingContent} />;
        case 46:// DragDropCategorization
            return< DragDropCategorization content={content as CategorizationContent}/>
        default:
            return <Typography p={2} color="text.secondary">Preview for Activity Type ID #{activityTypeId} is not implemented.</Typography>;
    }
};

export default ActivityRenderer; 