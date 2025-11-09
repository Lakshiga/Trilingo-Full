# Activity Components Similarity List

இந்த 4 activity types-க்கு ஒத்த components-ஐ list செய்யப்பட்டுள்ளது:

## 1. Fill-in-the-Blanks Pattern
**Characteristics**: Uses `signals`, `computed`, `effect`, has segments/options management

### Similar Components:
- ✅ **fill-in-the-blanks** (base component)
- ✅ **mcq-activity** (uses signals, computed, questions array)

### Related Fill-in-Blank Variants:
- **drag-drop-fill-in-blank** - Similar concept but uses drag-drop
- **multi-drag-drop-fill-in-blank** - Multiple blanks variant
- **word-bank-completion** - Similar fill-in concept with word bank
- **dropdown-completion** - Similar fill-in concept with dropdowns
- **letter-fill** - Similar fill-in concept for letters

---

## 2. Flashcard Pattern
**Characteristics**: Uses `@Input() content`, `@Input() currentLang`, `ViewChild`, simple display structure

### Similar Components (Basic Input Pattern):
- ✅ **flashcard** (base component)
- **audio-text-image-selection** - Similar input structure
- **character-grid** - Similar input structure
- **word-finder** - Similar input structure
- **story-player** - Similar input structure
- **video-player** - Similar input structure
- **song-player** - Similar input structure
- **recognition-grid** - Similar input structure
- **interactive-image-learning** - Similar input structure
- **tamil-vowels** - Similar input structure
- **sentence-builder** - Similar input structure
- **riddle-activity** - Similar input structure
- **word-scramble-exercise** - Similar input structure
- **true-false-quiz** - Similar input structure
- **sound-image-match** - Similar input structure
- **positional-scene-builder** - Similar input structure
- **letter-spotlight** - Similar input structure
- **first-letter-match** - Similar input structure
- **highlight** - Similar input structure
- **word-pair-mcq** - Similar input structure (uses ViewChild for audio)
- **letter-fill** - Similar input structure
- **letter-shape-matching** - Similar input structure
- **letter-sound-mcq** - Similar input structure
- **conversation-player** - Similar input structure
- **media-spotlight-single** - Similar input structure
- **media-spotlight-multiple** - Similar input structure
- **scene-finder** - Similar input structure
- **pronunciation-practice** - Similar input structure
- **reading-comprehension-match** - Similar input structure
- **sentence-ordering-activity** - Similar input structure
- **sentence-scramble-exercise** - Similar input structure
- **words-learning** - Similar input structure
- **word-splitter** - Similar input structure
- **equation-learn** - Similar input structure
- **equations** - Similar input structure
- **drag-and-drop-activity** - Similar input structure
- **drag-drop-categorization** - Similar input structure
- **drag-drop-image-matching** - Similar input structure
- **drag-drop-sentence** - Similar input structure
- **drag-drop-text-sort** - Similar input structure
- **drag-drop-word-match** - Similar input structure
- **listening-matching-drag-and-drop** - Similar input structure
- **listen-and-match** - Similar input structure
- **image-word-match** - Similar input structure

---

## 3. Matching Pattern
**Characteristics**: Uses `ReactiveFormsModule`, `FormBuilder`, `FormGroup`, `FormArray`, cards array

### Similar Components:
- ✅ **matching** (base component - only one using ReactiveFormsModule)

### Related Matching Variants (but different implementation):
- **sound-image-match** - Matching concept but different implementation
- **image-word-match** - Matching concept but different implementation
- **first-letter-match** - Matching concept but different implementation
- **listening-matching-drag-and-drop** - Matching concept but different implementation
- **listen-and-match** - Matching concept but different implementation
- **reading-comprehension-match** - Matching concept but different implementation

---

## 4. MCQ Activity Pattern
**Characteristics**: Uses `signals`, `computed`, `questions` array with `options`, `ChangeDetectionStrategy.OnPush`

### Similar Components:
- ✅ **mcq-activity** (base component)
- ✅ **fill-in-the-blanks** (uses signals, computed, effect)

### Related MCQ Variants:
- **word-pair-mcq** - MCQ concept but different implementation (no signals)
- **true-false-quiz** - MCQ-like concept but different implementation
- **letter-sound-mcq** - MCQ concept but different implementation

---

## Summary by Pattern Type:

### Signal-Based Components (Modern Angular):
1. **fill-in-the-blanks** ⭐
2. **mcq-activity** ⭐

### Form-Based Components:
1. **matching** ⭐

### Simple Input-Based Components (Traditional):
- All other 40+ components follow the basic `@Input() content` pattern similar to **flashcard** ⭐

---

## Notes:
- ⭐ = Base/Reference component
- Most components follow the **flashcard** pattern (simple @Input structure)
- Only **fill-in-the-blanks** and **mcq-activity** use modern Angular signals
- Only **matching** uses ReactiveFormsModule
- Fill-in-blank variants share similar concepts but different implementations

