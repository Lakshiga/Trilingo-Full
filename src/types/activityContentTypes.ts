// This file will hold the interfaces for all 18 activity content types.

export interface MCQChoice {
    id: string | number; // A unique identifier for the choice
    text: string;
    isCorrect: boolean;
}

export interface MCQContent {
    question: string;
    choices: MCQChoice[];
    // You could add optional properties later, like an image URL for the question
    // imageUrl?: string;
}

// --- NEW: Types for Matching Activity ---
export interface MatchItem {
    id: string; // Unique ID for this item (e.g., 'A', 'B', '1', '2')
    content: string; // The text to display
    matchId: string; // The ID of the item it should be paired with
}

export interface MatchingContent {
    columnA: MatchItem[]; // Items for the left column
    columnB: MatchItem[]; // Items for the right column
    // Optional title for the activity
    title?: string;
}

// --- NEW: Type for First Letter Word Match Activity ---
export interface FirstLetterMatchContent {
    title: string;
    words: string[];
}

// --- NEW: Type for Fill-in-the-Equation Activity ---
// --- REFINED: Type for Fill-in-the-Equation Activity ---
// This is much simpler and less prone to data entry errors.


// --- NEW: Type for Word Bank Sentence Completion ---
export interface SentenceWithBlank {
    id: number; // A unique ID for this sentence
    // The sentence parts before and after the blank
    prefix: string;
    suffix: string;
    correctAnswer: string;
}

export interface WordBankCompletionContent {
    title: string;
    sentences: SentenceWithBlank[];
    wordBank: string[];
}

// ... (existing types)

// --- NEW: Type for Dropdown Sentence Completion ---
export interface DropdownBlank {
    id: number; // Unique ID for this sentence
    prefix: string;
    suffix: string;
    options: string[]; // The choices for THIS specific dropdown
    correctAnswer: string;
}

export interface DropdownCompletionContent {
    title: string;
    sentences: DropdownBlank[];
}




// ... (existing types)










// --- NEW: Type for Recognition Grid Activity ---
export interface GridItem {
    id: number;         // Unique ID for this item
    imageUrl: string;
    audioUrl: string;   // The sound that identifies this as the correct answer
}

export interface RecognitionGridPage {
    // All possible items to display in the grid for this page (e.g., 6 images)
    gridItems: GridItem[]; 
    // The list of correct item IDs that the user must find on this page
    correctItemIds: number[]; 
}

export interface RecognitionGridContent {
    title: string;
    pages: RecognitionGridPage[];
}

// --- NEW: Type for Character Grid Activity ---
export interface CharacterGridItem {
    id: number;
    character: string; // The letter to display, e.g., "க"
    audioUrl: string;  // The audio of that letter's sound
}

export interface CharacterGridPage {
    gridItems: CharacterGridItem[];
    correctItemIds: number[];
}

export interface CharacterGridContent {
    title: string;
    pages: CharacterGridPage[];
}

// --- NEW: Type for Word Pair MCQ Activity ---
export interface WordPairQuestion {
    id: number;
    // The audio prompt to play for this question
    promptAudioUrl: string; 
    // The two words to display as choices
    choices: [string, string];
    // The correct word
    correctAnswer: string;
}

export interface WordPairMCQContent {
    title: string;
    questions: WordPairQuestion[];
}



// --- NEW: Type for Word Finder Activity ---
export interface WordFinderChallenge {
    targetLetter: string;
    wordGrid: string[];     // All words to display in the grid for this challenge
    correctWords: string[]; // The subset of words that are the correct answers
}

export interface WordFinderContent {
    title: string;
    challenges: WordFinderChallenge[];
}

// --- NEW: Type for Audio Text Image Selection Activity ---
export interface AudioTextImageSelectionContent {
    title: string;
    text: string;           // The text to display at the top center
    audioUrl: string;       // The audio file to play the text
    images: {
        id: number;
        imageUrl: string;
        isCorrect: boolean;
    }[];   
}

// --- NEW: Type for Drag Drop Image Matching Activity ---
export interface DragDropImageItem {
    id: number;
    imageUrl: string;
    audioUrl: string;       // Audio to play when image is clicked
    matchId: number;        // ID of the image it should match with
}

export interface DragDropImageMatchingContent {
    title: string;
    images: DragDropImageItem[];       // Single set of images - component will duplicate and shuffle
}

// --- NEW: Type for Interactive Image Learning Activity ---
export interface InteractiveObject {
    id: number;           // Unique ID for this clickable object
    name: string;         // The name/text of the object, e.g., "மரம்" (Tree)
    audioUrl: string;     // Audio file to play when clicked
    // Coordinates are percentages (0-100) for responsive design
    x: number;            // X-coordinate of the top-left corner
    y: number;            // Y-coordinate of the top-left corner
    width: number;        // Width of the clickable area
    height: number;       // Height of the clickable area
}

export interface InteractiveImageLearningContent {
    title: string;
    imageUrl: string;           // The main learning image
    backgroundAudioUrl?: string; // Optional background/ambient audio
    objects: InteractiveObject[]; // All clickable objects in the image
}

// --- NEW: Type for Letters Display Activity ---
export interface TamilVowel {
    id: number;
    letter: string;        // The Tamil vowel character, e.g., "அ"
    romanization: string;  // Roman equivalent, e.g., "a"
    audioUrl: string;      // Audio file for pronunciation
}

export interface LettersDisplayContent {
    title: string;
    description?: string;
    vowels: TamilVowel[];  // Should contain all 12 vowels
    introAudioUrl?: string; // Optional intro audio
}

// --- NEW: Type for Equation Learn Activity ---
export interface UyirMeiEquation {
    id: number;
    consonant: string;          // The consonant, e.g., "க்"
    consonantAudioUrl: string;  // Audio for consonant
    vowel: string;              // The vowel, e.g., "அ"
    vowelAudioUrl: string;      // Audio for vowel
    result: string;             // The combined result, e.g., "க"
    resultAudioUrl: string;     // Audio for the result
    romanization?: string;      // Optional romanization, e.g., "ka"
}

export interface EquationLernContent {
    title: string;
    description?: string;
    equations: UyirMeiEquation[]; // Array of consonant + vowel combinations
    introAudioUrl?: string;       // Optional intro audio
}