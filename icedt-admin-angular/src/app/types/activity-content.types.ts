// Activity content types for Angular

export interface MCQChoice {
    id: string | number;
    text: string;
    isCorrect: boolean;
}

export interface MCQContent {
    question: string;
    choices: MCQChoice[];
}

export interface MatchItem {
    id: string;
    content: string;
    matchId: string;
}

export interface MatchingContent {
    columnA: MatchItem[];
    columnB: MatchItem[];
    title?: string;
}

export interface FirstLetterMatchContent {
    title: string;
    words: string[];
}

export interface SentenceWithBlank {
    id: number;
    prefix: string;
    suffix: string;
    correctAnswer: string;
}

export interface WordBankCompletionContent {
    title: string;
    sentences: SentenceWithBlank[];
    wordBank: string[];
}

export interface DropdownBlank {
    id: number;
    prefix: string;
    suffix: string;
    options: string[];
    correctAnswer: string;
}

export interface DropdownCompletionContent {
    title: string;
    sentences: DropdownBlank[];
}

export interface GridItem {
    id: number;
    imageUrl: string;
    audioUrl: string;
}

export interface RecognitionGridPage {
    gridItems: GridItem[];
    correctItemIds: number[];
}

export interface RecognitionGridContent {
    title: string;
    pages: RecognitionGridPage[];
}

export interface CharacterGridItem {
    id: number;
    character: string;
    audioUrl: string;
}

export interface CharacterGridPage {
    gridItems: CharacterGridItem[];
    correctItemIds: number[];
}

export interface CharacterGridContent {
    title: string;
    pages: CharacterGridPage[];
}

export interface WordPairQuestion {
    id: number;
    promptAudioUrl: string;
    choices: [string, string];
    correctAnswer: string;
}

export interface WordPairMCQContent {
    title: string;
    questions: WordPairQuestion[];
}

export interface WordFinderChallenge {
    targetLetter: string;
    wordGrid: string[];
    correctWords: string[];
}

export interface WordFinderContent {
    title: string;
    challenges: WordFinderChallenge[];
}

export interface AudioTextImageSelectionContent {
    title: string;
    text: string;
    audioUrl: string;
    images: {
        id: number;
        imageUrl: string;
        isCorrect: boolean;
    }[];
}

export interface DragDropImageItem {
    id: number;
    imageUrl: string;
    audioUrl: string;
    matchId: number;
}

export interface DragDropImageMatchingContent {
    title: string;
    images: DragDropImageItem[];
}

export interface InteractiveObject {
    id: number;
    name: string;
    audioUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface InteractiveImageLearningContent {
    title: string;
    imageUrl: string;
    backgroundAudioUrl?: string;
    objects: InteractiveObject[];
}

export interface TamilVowel {
    id: number;
    letter: string;
    romanization: string;
    audioUrl: string;
}

export interface LettersDisplayContent {
    title: string;
    description?: string;
    vowels: TamilVowel[];
    introAudioUrl?: string;
}

export interface UyirMeiEquation {
    id: number;
    consonant: string;
    consonantAudioUrl: string;
    vowel: string;
    vowelAudioUrl: string;
    result: string;
    resultAudioUrl: string;
    romanization?: string;
}

export interface EquationLernContent {
    title: string;
    description?: string;
    equations: UyirMeiEquation[];
    introAudioUrl?: string;
}

export interface FlashcardContent {
    title: string;
    word: string;
    imageUrl: string;
    audioUrl?: string;
}

export interface ImageChoice {
    id: string;
    imageUrl: string;
    isCorrect: boolean;
}

export interface ImageChoiceActivityProps {
    title: string;
    options: ImageChoice[];
}

export interface TrueFalseQuestion {
    id: number;
    statement: string;
    isCorrect: boolean;
}

export interface TrueFalseQuizContent {
    id: number;
    title: string;
    questions: TrueFalseQuestion[];
}

export interface WordChoice {
    id: string;
    text: string;
}

export interface DragDropFillInBlankContent {
    id: number;
    title: string;
    promptParts: [string, string];
    choices: WordChoice[];
    correctAnswer: string;
}

export interface LyricLine {
    text: string;
    timestamp: number;
}

export interface SongContent {
    title: string;
    artist?: string;
    albumArtUrl?: string;
    audioUrl: string;
    lyrics: LyricLine[];
}

export interface VideoPlayerContent {
    title: string;
    description?: string;
    videoUrl: string;
}

export interface CharacterGridItem {
    id: number;
    character: string;
    audioUrl: string;
}

export interface CharacterGridContent {
    title: string;
    gridItems: CharacterGridItem[];
    correctItemIds: number[];
}

export interface GridItem {
    id: number;
    imageUrl: string;
    audioUrl: string;
}

export interface RecognitionGridContent {
    title: string;
    gridItems: GridItem[];
    correctItemIds: number[];
}

export interface ChatMessage {
    speaker: string;
    avatar?: string;
    text: string;
    timestamp: number;
}

export interface ConversationContent {
    title: string;
    audioUrl: string;
    messages: ChatMessage[];
}

export interface Word {
    id: string;
    text: string;
    category: string;
}

export interface Category {
    id: string;
    title: string;
}

export interface DragDropContent {
    title: string;
    activityTitle: string;
    instruction: string;
    words: Word[];
    categories: Category[];
}

export interface Equation {
    leftOperand: string;
    rightOperand: string;
    correctAnswer: string;
    options: string[];
}