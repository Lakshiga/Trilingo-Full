import { MultilingualActivityContent } from '../types/multilingual-activity-content.types';

export class MultilingualActivityTemplates {
  
  static getTemplate(activityTypeId: number): string {
    const templates: { [key: number]: () => string } = {
      // All 51 activity types with their corresponding templates
      1: () => this.getFlashcardTemplate(),
      2: () => this.getMediaSpotlightMultipleTemplate(),
      3: () => this.getMediaSpotlightSingleTemplate(),
      4: () => this.getEquationLearnTemplate(),
      5: () => this.getConversationPlayerTemplate(),
      6: () => this.getSongPlayerTemplate(),
      7: () => this.getRecognitionGridTemplate(),
      8: () => this.getCharacterGridTemplate(),
      9: () => this.getWordPairMCQTemplate(),
      10: () => this.getWordFinderTemplate(),
      11: () => this.getSceneFinderTemplate(),
      12: () => this.getStoryPlayerTemplate(),
      13: () => this.getMCQActivityTemplate(),
      14: () => this.getAudioTextImageSelectionTemplate(),
      15: () => this.getDragDropImageMatchingTemplate(),
      16: () => this.getVideoPlayerTemplate(),
      17: () => this.getLetterFillTemplate(),
      18: () => this.getLetterSoundMcqTemplate(),
      19: () => this.getDragAndDropActivityTemplate(),
      20: () => this.getInteractiveImageLearningTemplate(),
      21: () => this.getLetterShapeMatchingTemplate(),
      22: () => this.getWordScrambleExerciseTemplate(),
      23: () => this.getTamilVowelsTemplate(),
      24: () => this.getEquationLearnTemplate(),
      25: () => this.getSentenceScrambleExerciseTemplate(),
      26: () => this.getSentenceBuilderTemplate(),
      27: () => this.getWordsLearningTemplate(),
      28: () => this.getPronunciationPracticeTemplate(),
      29: () => this.getRiddleActivityTemplate(),
      30: () => this.getDragDropWordMatchTemplate(),
      31: () => this.getReadingComprehensionMatchTemplate(),
      32: () => this.getMatchingActivityTemplate(),
      33: () => this.getDragDropSentenceTemplate(),
      34: () => this.getDragDropFillInBlankTemplate(),
      35: () => this.getDragDropTextSortTemplate(),
      36: () => this.getMultiDragDropFillInBlankTemplate(),
      37: () => this.getHighlightingActivityTemplate(),
      38: () => this.getWordSplitterTemplate(),
      39: () => this.getDropdownCompletionTemplate(),
      40: () => this.getTrueFalseQuizTemplate(),
      41: () => this.getImageWordMatchTemplate(),
      42: () => this.getSoundImageMatchTemplate(),
      43: () => this.getSentenceOrderingActivityTemplate(),
      44: () => this.getPositionalSceneBuilderTemplate(),
      45: () => this.getListeningMatchingDragAndDropTemplate(),
      46: () => this.getDragDropCategorizationTemplate(),
      47: () => this.getLetterSpotlightTemplate(),
      48: () => this.getWordBankCompletionTemplate(),
      49: () => this.getFirstLetterMatchTemplate(),
      50: () => this.getHighlightTemplate(),
      51: () => this.getMatchingTemplate()
    };

    const templateFunction = templates[activityTypeId];
    return templateFunction ? templateFunction() : this.getDefaultTemplate();
  }

  private static getFlashcardTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "ஃபிளாஷ் கார்டு",
        en: "ytgy",
        si: "ෆ්ලෑෂ් කාඩ්"
      },
      instruction: {
        ta: "சொற்களைக் கற்றுக்கொள்ளுங்கள்",
        en: "Learn the words",
        si: "වචන ඉගෙන ගන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "உதாரணம்",
            en: "Example",
            si: "උදාහරණය"
          },
          audioUrl: {
            ta: "/audio/ta/example.mp3",
            en: "/audio/en/example.mp3",
            si: "/audio/si/example.mp3"
          },
          imageUrl: {
            default: "/images/example.png"
          }
        }
      ]
    }, null, 2);
  }

  private static getMCQActivityTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பல தேர்வு கேள்வி",
        en: "Multiple Choice Question",
        si: "බහු තේරීම් ප්‍රශ්නය"
      },
      instruction: {
        ta: "சரியான பதிலைத் தேர்ந்தெடுக்கவும்",
        en: "Choose the correct answer",
        si: "නිවැරදි පිළිතුර තෝරන්න"
      },
      question: {
        ta: "இது என்ன?",
        en: "What is this?",
        si: "මේක මොකක්ද?"
      },
      choices: [
        {
          id: "1",
          text: {
            ta: "விருப்பம் 1",
            en: "Option 1",
            si: "විකල්පය 1"
          },
          isCorrect: true
        },
        {
          id: "2",
          text: {
            ta: "விருப்பம் 2",
            en: "Option 2",
            si: "විකල්පය 2"
          },
          isCorrect: false
        }
      ]
    }, null, 2);
  }

  private static getStoryPlayerTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "கதை",
        en: "Story",
        si: "කතාව"
      },
      story: {
        ta: "ஒரு காலத்தில் ஒரு சிறிய கிராமத்தில் ஒரு பையன் வாழ்ந்தான்...",
        en: "Once upon a time, in a small village, there lived a boy...",
        si: "කලකට පෙර කුඩා ගමක බාල පිරිමි ළමයෙක් ජීවත් වූයේ..."
      },
      audioUrl: {
        ta: "/audio/ta/story.mp3",
        en: "/audio/en/story.mp3",
        si: "/audio/si/story.mp3"
      },
      imageUrl: {
        default: "/images/story.png"
      }
    }, null, 2);
  }

  private static getVideoPlayerTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "வீடியோ பாடம்",
        en: "Video Lesson",
        si: "වීඩියෝ පාඩම"
      },
      instruction: {
        ta: "வீடியோவைப் பார்த்து கற்றுக்கொள்ளுங்கள்",
        en: "Watch the video and learn",
        si: "වීඩියෝව නරඹා ඉගෙන ගන්න"
      },
      videoUrl: "/videos/lesson.mp4",
      subtitles: {
        ta: "வீடியோ வசனங்கள்",
        en: "Video subtitles",
        si: "වීඩියෝ උපසිරැසි"
      }
    }, null, 2);
  }

  private static getSongPlayerTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பாடல்",
        en: "Song",
        si: "ගීතය"
      },
      instruction: {
        ta: "பாடலைக் கேட்டு பாடுங்கள்",
        en: "Listen and sing the song",
        si: "ගීතය අසා ගායනා කරන්න"
      },
      songUrl: "/audio/song.mp3",
      lyrics: {
        ta: "பாடல் வரிகள்...",
        en: "Song lyrics...",
        si: "ගීත වාක්‍ය..."
      }
    }, null, 2);
  }

  private static getSceneFinderTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "காட்சியில் கண்டுபிடி",
        en: "Find in Scene",
        si: "දර්ශනයේ සොයන්න"
      },
      sceneImageUrl: "/images/scene.png",
      sceneAudioUrl: {
        ta: "/audio/ta/scene.mp3",
        en: "/audio/en/scene.mp3",
        si: "/audio/si/scene.mp3"
      },
      hotspots: [
        {
          id: 1,
          name: {
            ta: "மரம்",
            en: "Tree",
            si: "ගස"
          },
          audioUrl: {
            ta: "/audio/ta/tree.mp3",
            en: "/audio/en/tree.mp3",
            si: "/audio/si/tree.mp3"
          },
          x: 30,
          y: 20,
          width: 15,
          height: 25
        }
      ]
    }, null, 2);
  }

  private static getListeningMatchingDragAndDropTemplate(): string {
    return JSON.stringify({
      title: "Listen and Match",
      introduction: "Listen to the sound and match the correct word",
      sentences: [
        {
          id: "1",
          preBlankText: "This is a",
          postBlankText: "",
          audioUrl: "/audio/en/sentence1.mp3",
          correctWordId: "1"
        }
      ],
      words: [
        {
          id: "1",
          text: "Book"
        }
      ]
    }, null, 2);
  }

  private static getSentenceOrderingActivityTemplate(): string {
    return JSON.stringify({
      activityTitle: {
        ta: "வாக்கிய வரிசைப்படுத்துதல்",
        en: "Sentence Ordering",
        si: "වාක්‍ය අනුපිළිවෙල"
      },
      instruction: {
        ta: "வாக்கியங்களை சரியான வரிசையில் வைக்கவும்",
        en: "Arrange the sentences in correct order",
        si: "වාක්‍ය නිවැරදි අනුපිළිවෙලට සකස් කරන්න"
      },
      imageUrl: {
        default: "/images/sentence-ordering.png"
      },
      sentences: [
        {
          id: "1",
          text: {
            ta: "முதல் வாக்கியம்",
            en: "First sentence",
            si: "පළමු වාක්‍යය"
          },
          correctOrder: 1
        },
        {
          id: "2",
          text: {
            ta: "இரண்டாவது வாக்கியம்",
            en: "Second sentence",
            si: "දෙවන වාක්‍යය"
          },
          correctOrder: 2
        }
      ]
    }, null, 2);
  }

  private static getReadingComprehensionMatchTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "படித்து புரிந்துகொள்ளுதல்",
        en: "Reading Comprehension",
        si: "කියවීමේ අවබෝධය"
      },
      passage: {
        ta: "பத்தியின் உள்ளடக்கம்...",
        en: "Passage content...",
        si: "ප්‍රග්‍රන්ථ අන්තර්ගතය..."
      },
      passageAudioUrl: {
        ta: "/audio/ta/passage.mp3",
        en: "/audio/en/passage.mp3",
        si: "/audio/si/passage.mp3"
      },
      questions: [
        {
          id: 1,
          text: {
            ta: "முதல் கேள்வி?",
            en: "First question?",
            si: "පළමු ප්‍රශ්නය?"
          },
          audioUrl: {
            ta: "/audio/ta/question1.mp3",
            en: "/audio/en/question1.mp3",
            si: "/audio/si/question1.mp3"
          }
        }
      ],
      answers: [
        {
          id: 1,
          text: {
            ta: "முதல் பதில்",
            en: "First answer",
            si: "පළමු පිළිතුර"
          },
          matchId: 1
        }
      ]
    }, null, 2);
  }

  private static getPronunciationPracticeTemplate(): string {
    return JSON.stringify({
      id: 1,
      title: {
        ta: "உச்சரிப்பு பயிற்சி",
        en: "Pronunciation Practice",
        si: "උච්චාරණ පුහුණුව"
      },
      text: {
        ta: "உதாரண சொல்",
        en: "Example word",
        si: "උදාහරණ වචනය"
      },
      audioUrl: {
        ta: "/audio/ta/pronunciation.mp3",
        en: "/audio/en/pronunciation.mp3",
        si: "/audio/si/pronunciation.mp3"
      }
    }, null, 2);
  }

  private static getDefaultTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "செயல்பாட்டின் தலைப்பு",
        en: "Activity Title",
        si: "ක්‍රියාකාරකමේ මාතෘකාව"
      },
      instruction: {
        ta: "வழிமுறைகள்",
        en: "Instructions",
        si: "උපදෙස්"
      },
      content: {
        ta: "உள்ளடக்கம்",
        en: "Content",
        si: "අන්තර්ගතය"
      }
    }, null, 2);
  }

  // Activity Type 2: MediaSpotlightMultiple
  private static getMediaSpotlightMultipleTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பல ஊடக ஒளிவீச்சு",
        en: "Multiple Media Spotlight",
        si: "බහු මාධ්‍ය ආලෝකය"
      },
      instruction: {
        ta: "பல ஊடகங்களைக் கண்டறிந்து கற்றுக்கொள்ளுங்கள்",
        en: "Identify and learn from multiple media",
        si: "බහු මාධ්‍ය හඳුනාගෙන ඉගෙන ගන්න"
      },
      mediaItems: [
        {
          id: "1",
          type: "image",
          url: "/images/media1.png",
          text: {
            ta: "உதாரண படம்",
            en: "Example image",
            si: "උදාහරණ රූපය"
          },
          audioUrl: {
            ta: "/audio/ta/media1.mp3",
            en: "/audio/en/media1.mp3",
            si: "/audio/si/media1.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 3: MediaSpotlightSingle
  private static getMediaSpotlightSingleTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "ஒற்றை ஊடக ஒளிவீச்சு",
        en: "Single Media Spotlight",
        si: "තනි මාධ්‍ය ආලෝකය"
      },
      instruction: {
        ta: "ஊடகத்தைக் கண்டறிந்து கற்றுக்கொள்ளுங்கள்",
        en: "Identify and learn from the media",
        si: "මාධ්‍ය හඳුනාගෙන ඉගෙන ගන්න"
      },
      mediaType: "image",
      mediaUrl: "/images/spotlight.png",
      text: {
        ta: "ஒளிவீச்சு உள்ளடக்கம்",
        en: "Spotlight content",
        si: "ආලෝක අන්තර්ගතය"
      },
      audioUrl: {
        ta: "/audio/ta/spotlight.mp3",
        en: "/audio/en/spotlight.mp3",
        si: "/audio/si/spotlight.mp3"
      }
    }, null, 2);
  }

  // Activity Type 4: EquationLearn
  private static getEquationLearnTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சமன்பாடு கற்றல்",
        en: "Equation Learning",
        si: "සමීකරණ ඉගෙනීම"
      },
      instruction: {
        ta: "சமன்பாடுகளைத் தீர்த்து கற்றுக்கொள்ளுங்கள்",
        en: "Solve and learn equations",
        si: "සමීකරණ විසඳා ඉගෙන ගන්න"
      },
      equations: [
        {
          id: "1",
          leftOperand: "5",
          rightOperand: "3",
          operator: "+",
          answer: "8",
          explanation: {
            ta: "ஐந்து கூட்டல் மூன்று சமம் எட்டு",
            en: "Five plus three equals eight",
            si: "පහ එකතු කර තුන සමාන අට"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 5: ConversationPlayer
  private static getConversationPlayerTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "உரையாடல் இயக்கி",
        en: "Conversation Player",
        si: "සංවාද වාදකය"
      },
      instruction: {
        ta: "உரையாடலைக் கேட்டு பின்பற்றுங்கள்",
        en: "Listen and follow the conversation",
        si: "සංවාදය අසා අනුගමනය කරන්න"
      },
      audioUrl: {
        ta: "/audio/ta/conversation.mp3",
        en: "/audio/en/conversation.mp3",
        si: "/audio/si/conversation.mp3"
      },
      messages: [
        {
          id: "1",
          speaker: "Person A",
          text: {
            ta: "வணக்கம்! எப்படி இருக்கிறீர்கள்?",
            en: "Hello! How are you?",
            si: "ආයුබෝවන්! කොහොමද ඔබ?"
          },
          timestamp: 0
        },
        {
          id: "2",
          speaker: "Person B",
          text: {
            ta: "நன்றாக இருக்கிறேன், நன்றி!",
            en: "I'm fine, thank you!",
            si: "මම හොඳින්, ස්තූතියි!"
          },
          timestamp: 3000
        }
      ]
    }, null, 2);
  }

  // Activity Type 7: RecognitionGrid
  private static getRecognitionGridTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "அங்கீகார கட்டம்",
        en: "Recognition Grid",
        si: "හඳුනාගැනීමේ ජාලය"
      },
      instruction: {
        ta: "கட்டத்தில் உள்ள பொருட்களை அங்கீகரிக்கவும்",
        en: "Recognize the items in the grid",
        si: "ජාලයේ ඇති අයිතම හඳුනාගන්න"
      },
      gridItems: [
        {
          id: "1",
          text: {
            ta: "பூ",
            en: "Flower",
            si: "මල"
          },
          imageUrl: "/images/flower.png",
          audioUrl: {
            ta: "/audio/ta/flower.mp3",
            en: "/audio/en/flower.mp3",
            si: "/audio/si/flower.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 8: CharacterGrid
  private static getCharacterGridTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "எழுத்து கட்டம்",
        en: "Character Grid",
        si: "අකුරු ජාලය"
      },
      instruction: {
        ta: "எழுத்துகளைக் கண்டறிந்து கற்றுக்கொள்ளுங்கள்",
        en: "Identify and learn characters",
        si: "අකුරු හඳුනාගෙන ඉගෙන ගන්න"
      },
      characters: [
        {
          id: "1",
          character: "அ",
          word: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          imageUrl: "/images/mother.png",
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 9: WordPairMCQ
  private static getWordPairMCQTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொல் ஜோடி பல தேர்வு",
        en: "Word Pair MCQ",
        si: "වචන යුගල බහු තේරීම්"
      },
      instruction: {
        ta: "சரியான சொல் ஜோடியைத் தேர்ந்தெடுக்கவும்",
        en: "Choose the correct word pair",
        si: "නිවැරදි වචන යුගලය තෝරන්න"
      },
      questions: [
        {
          id: "1",
          word1: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          word2: {
            ta: "படித்தல்",
            en: "Reading",
            si: "කියවීම"
          },
          isCorrect: true
        }
      ]
    }, null, 2);
  }

  // Activity Type 10: WordFinder
  private static getWordFinderTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொல் கண்டுபிடிப்பான்",
        en: "Word Finder",
        si: "වචන සොයන්නා"
      },
      instruction: {
        ta: "கட்டத்தில் சொற்களைக் கண்டுபிடிக்கவும்",
        en: "Find words in the grid",
        si: "ජාලයේ වචන සොයන්න"
      },
      grid: [
        ["ப", "உ", "த", "த", "க", "ம்"],
        ["அ", "ம", "ம", "ா", "்", "்"]
      ],
      words: [
        {
          id: "1",
          text: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          positions: [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5]]
        }
      ]
    }, null, 2);
  }

  // Activity Type 14: AudioTextImageSelection
  private static getAudioTextImageSelectionTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "ஒலி உரை படம் தேர்வு",
        en: "Audio Text Image Selection",
        si: "ශ්‍රව්‍ය පෙළ රූප තේරීම"
      },
      instruction: {
        ta: "ஒலியைக் கேட்டு சரியான படத்தைத் தேர்ந்தெடுக்கவும்",
        en: "Listen to the audio and select the correct image",
        si: "ශ්‍රව්‍ය අසා නිවැරදි රූපය තෝරන්න"
      },
      audioUrl: {
        ta: "/audio/ta/selection.mp3",
        en: "/audio/en/selection.mp3",
        si: "/audio/si/selection.mp3"
      },
      options: [
        {
          id: "1",
          imageUrl: "/images/option1.png",
          text: {
            ta: "விருப்பம் 1",
            en: "Option 1",
            si: "විකල්පය 1"
          },
          isCorrect: true
        },
        {
          id: "2",
          imageUrl: "/images/option2.png",
          text: {
            ta: "விருப்பம் 2",
            en: "Option 2",
            si: "විකල්පය 2"
          },
          isCorrect: false
        }
      ]
    }, null, 2);
  }

  // Activity Type 15: DragDropImageMatching
  private static getDragDropImageMatchingTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு படம் பொருத்துதல்",
        en: "Drag Drop Image Matching",
        si: "ගෙනයා දමන රූප ගැලපීම"
      },
      instruction: {
        ta: "படங்களை இழுத்து விடுங்கள்",
        en: "Drag and drop the images",
        si: "රූප ගෙනයා දමන්න"
      },
      images: [
        {
          id: "1",
          imageUrl: "/images/drag1.png",
          text: {
            ta: "படம் 1",
            en: "Image 1",
            si: "රූපය 1"
          },
          matchId: "1"
        }
      ],
      targets: [
        {
          id: "1",
          text: {
            ta: "இலக்கு 1",
            en: "Target 1",
            si: "ඉලක්කය 1"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 17: LetterFill
  private static getLetterFillTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "எழுத்து நிரப்புதல்",
        en: "Letter Fill",
        si: "අකුරු පුරවීම"
      },
      instruction: {
        ta: "விடுபட்ட எழுத்துகளை நிரப்பவும்",
        en: "Fill in the missing letters",
        si: "නැති අකුරු පුරවන්න"
      },
      words: [
        {
          id: "1",
          incomplete: "_ம்மா",
          complete: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          missingLetter: "அ",
          imageUrl: "/images/mother.png",
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 18: LetterSoundMcq
  private static getLetterSoundMcqTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "எழுத்து ஒலி பல தேர்வு",
        en: "Letter Sound MCQ",
        si: "අකුරු ශබ්ද බහු තේරීම්"
      },
      instruction: {
        ta: "எழுத்தின் ஒலியைக் கேட்டு சரியான பதிலைத் தேர்ந்தெடுக்கவும்",
        en: "Listen to the letter sound and choose the correct answer",
        si: "අකුරු ශබ්දය අසා නිවැරදි පිළිතුර තෝරන්න"
      },
      questions: [
        {
          id: "1",
          letter: "அ",
          audioUrl: {
            ta: "/audio/ta/letter_a.mp3",
            en: "/audio/en/letter_a.mp3",
            si: "/audio/si/letter_a.mp3"
          },
          choices: [
            {
              id: "1",
              text: "அ",
              isCorrect: true
            },
            {
              id: "2",
              text: "ஆ",
              isCorrect: false
            }
          ]
        }
      ]
    }, null, 2);
  }

  // Activity Type 19: DragAndDropActivity
  private static getDragAndDropActivityTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு செயல்பாடு",
        en: "Drag and Drop Activity",
        si: "ගෙනයා දමන ක්‍රියාකාරකම"
      },
      instruction: {
        ta: "பொருட்களை இழுத்து விடுங்கள்",
        en: "Drag and drop the items",
        si: "අයිතම ගෙනයා දමන්න"
      },
      draggableItems: [
        {
          id: "1",
          text: {
            ta: "இழுக்கக்கூடிய பொருள்",
            en: "Draggable item",
            si: "ගෙනයා දිය හැකි අයිතමය"
          },
          imageUrl: "/images/draggable.png"
        }
      ],
      dropZones: [
        {
          id: "1",
          text: {
            ta: "விடு மண்டலம்",
            en: "Drop zone",
            si: "දමන කලාපය"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 20: InteractiveImageLearning
  private static getInteractiveImageLearningTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "ஊடாடும் படம் கற்றல்",
        en: "Interactive Image Learning",
        si: "අන්තර්ක්‍රියාකාරී රූප ඉගෙනීම"
      },
      instruction: {
        ta: "படத்தில் உள்ள பகுதிகளைக் கிளிக் செய்து கற்றுக்கொள்ளுங்கள்",
        en: "Click on parts of the image to learn",
        si: "ඉගෙන ගැනීමට රූපයේ කොටස් ක්ලික් කරන්න"
      },
      imageUrl: "/images/interactive.png",
      hotspots: [
        {
          id: "1",
          name: {
            ta: "ஹாட்ஸ்பாட் 1",
            en: "Hotspot 1",
            si: "හොට්ස්පොට් 1"
          },
          x: 30,
          y: 20,
          width: 15,
          height: 25,
          audioUrl: {
            ta: "/audio/ta/hotspot1.mp3",
            en: "/audio/en/hotspot1.mp3",
            si: "/audio/si/hotspot1.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 21: LetterShapeMatching
  private static getLetterShapeMatchingTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "எழுத்து வடிவ பொருத்துதல்",
        en: "Letter Shape Matching",
        si: "අකුරු හැඩය ගැලපීම"
      },
      instruction: {
        ta: "எழுத்துகளின் வடிவங்களைப் பொருத்தவும்",
        en: "Match the letter shapes",
        si: "අකුරු හැඩයන් ගැලපීම"
      },
      letters: [
        {
          id: "1",
          letter: "அ",
          shape: "/images/shape_a.png",
          audioUrl: {
            ta: "/audio/ta/letter_a.mp3",
            en: "/audio/en/letter_a.mp3",
            si: "/audio/si/letter_a.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 22: WordScrambleExercise
  private static getWordScrambleExerciseTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொல் குழப்பு பயிற்சி",
        en: "Word Scramble Exercise",
        si: "වචන කලබල පුහුණුව"
      },
      instruction: {
        ta: "குழப்பப்பட்ட எழுத்துகளை சரியான வரிசையில் வைக்கவும்",
        en: "Arrange the scrambled letters in correct order",
        si: "කලබල වූ අකුරු නිවැරදි අනුපිළිවෙලට සකස් කරන්න"
      },
      words: [
        {
          id: "1",
          scrambled: "ம்மஅ",
          correct: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          hint: {
            ta: "தாய்",
            en: "Mother",
            si: "අම්මා"
          },
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 23: TamilVowels
  private static getTamilVowelsTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "தமிழ் உயிரெழுத்துகள்",
        en: "Tamil Vowels",
        si: "දමිළ ස්වර"
      },
      instruction: {
        ta: "தமிழ் உயிரெழுத்துகளைக் கற்றுக்கொள்ளுங்கள்",
        en: "Learn Tamil vowels",
        si: "දමිළ ස්වර ඉගෙන ගන්න"
      },
      vowels: [
        {
          id: "1",
          vowel: "அ",
          word: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          imageUrl: "/images/mother.png",
          audioUrl: {
            ta: "/audio/ta/vowel_a.mp3",
            en: "/audio/en/vowel_a.mp3",
            si: "/audio/si/vowel_a.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 25: SentenceScrambleExercise
  private static getSentenceScrambleExerciseTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "வாக்கிய குழப்பு பயிற்சி",
        en: "Sentence Scramble Exercise",
        si: "වාක්‍ය කලබල පුහුණුව"
      },
      instruction: {
        ta: "குழப்பப்பட்ட வார்த்தைகளை சரியான வரிசையில் வைக்கவும்",
        en: "Arrange the scrambled words in correct order",
        si: "කලබල වූ වචන නිවැරදි අනුපිළිවෙලට සකස් කරන්න"
      },
      sentences: [
        {
          id: "1",
          scrambled: ["ஒரு", "காலத்தில்", "ஒரு", "சிறிய", "கிராமத்தில்"],
          correct: {
            ta: "ஒரு காலத்தில் ஒரு சிறிய கிராமத்தில்",
            en: "Once upon a time in a small village",
            si: "කලකට පෙර කුඩා ගමක"
          },
          audioUrl: {
            ta: "/audio/ta/sentence1.mp3",
            en: "/audio/en/sentence1.mp3",
            si: "/audio/si/sentence1.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 26: SentenceBuilder
  private static getSentenceBuilderTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "வாக்கிய கட்டமைப்பான்",
        en: "Sentence Builder",
        si: "වාක්‍ය ගොඩනැගීම"
      },
      instruction: {
        ta: "வார்த்தைகளைப் பயன்படுத்தி வாக்கியத்தைக் கட்டமைக்கவும்",
        en: "Build a sentence using the words",
        si: "වචන භාවිතා කර වාක්‍යයක් ගොඩනඟන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "நான்",
            en: "I",
            si: "මම"
          }
        },
        {
          id: "2",
          text: {
            ta: "பள்ளிக்கூடம்",
            en: "School",
            si: "පාසල"
          }
        }
      ],
      targetSentence: {
        ta: "நான் பள்ளிக்கூடம் போகிறேன்",
        en: "I go to school",
        si: "මම පාසලට යනවා"
      }
    }, null, 2);
  }

  // Activity Type 27: WordsLearning
  private static getWordsLearningTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொற்கள் கற்றல்",
        en: "Words Learning",
        si: "වචන ඉගෙනීම"
      },
      instruction: {
        ta: "புதிய சொற்களைக் கற்றுக்கொள்ளுங்கள்",
        en: "Learn new words",
        si: "නව වචන ඉගෙන ගන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          imageUrl: "/images/book.png",
          audioUrl: {
            ta: "/audio/ta/book.mp3",
            en: "/audio/en/book.mp3",
            si: "/audio/si/book.mp3"
          },
          meaning: {
            ta: "படிக்கும் பொருள்",
            en: "Object for reading",
            si: "කියවීම සඳහා වස්තුව"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 29: RiddleActivity
  private static getRiddleActivityTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "புதிர் செயல்பாடு",
        en: "Riddle Activity",
        si: "ගැටලු ක්‍රියාකාරකම"
      },
      instruction: {
        ta: "புதிர்களைத் தீர்த்து பதிலைக் கண்டறியவும்",
        en: "Solve the riddles and find the answer",
        si: "ගැටලු විසඳා පිළිතුර සොයන්න"
      },
      riddles: [
        {
          id: "1",
          question: {
            ta: "என்னைக் கேட்டால் பதில் சொல்லும், என்னைத் தொட்டால் மௌனமாகும்?",
            en: "I speak when asked, I become silent when touched?",
            si: "ඇසූ විට කතා කරමි, ස්පර්ශ කළ විට නිහඬ වෙමි?"
          },
          answer: {
            ta: "தொலைபேசி",
            en: "Telephone",
            si: "දුරකථනය"
          },
          hint: {
            ta: "தொடர்பு கருவி",
            en: "Communication device",
            si: "සන්නිවේදන උපකරණය"
          },
          audioUrl: {
            ta: "/audio/ta/riddle1.mp3",
            en: "/audio/en/riddle1.mp3",
            si: "/audio/si/riddle1.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 30: DragDropWordMatch
  private static getDragDropWordMatchTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு சொல் பொருத்துதல்",
        en: "Drag Drop Word Match",
        si: "ගෙනයා දමන වචන ගැලපීම"
      },
      instruction: {
        ta: "சொற்களை இழுத்து விடுங்கள்",
        en: "Drag and drop the words",
        si: "වචන ගෙනයා දමන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          matchId: "1"
        }
      ],
      targets: [
        {
          id: "1",
          text: {
            ta: "படிக்கும் பொருள்",
            en: "Reading material",
            si: "කියවීමේ ද්‍රව්‍ය"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 32: MatchingActivity
  private static getMatchingActivityTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பொருத்துதல் செயல்பாடு",
        en: "Matching Activity",
        si: "ගැලපීමේ ක්‍රියාකාරකම"
      },
      instruction: {
        ta: "சரியான ஜோடிகளைப் பொருத்தவும்",
        en: "Match the correct pairs",
        si: "නිවැරදි යුගල ගැලපීම"
      },
      columnA: [
        {
          id: "1",
          content: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          matchId: "1"
        }
      ],
      columnB: [
        {
          id: "1",
          content: {
            ta: "படித்தல்",
            en: "Reading",
            si: "කියවීම"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 33: DragDropSentence
  private static getDragDropSentenceTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு வாக்கியம்",
        en: "Drag Drop Sentence",
        si: "ගෙනයා දමන වාක්‍යය"
      },
      instruction: {
        ta: "வார்த்தைகளை இழுத்து விடுங்கள்",
        en: "Drag and drop the words",
        si: "වචන ගෙනයා දමන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "நான்",
            en: "I",
            si: "මම"
          }
        }
      ],
      sentence: {
        ta: "நான் பள்ளிக்கூடம் போகிறேன்",
        en: "I go to school",
        si: "මම පාසලට යනවා"
      }
    }, null, 2);
  }

  // Activity Type 34: DragDropFillInBlank
  private static getDragDropFillInBlankTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு வெற்றிட நிரப்புதல்",
        en: "Drag Drop Fill in Blank",
        si: "ගෙනයා දමන හිස් පුරවීම"
      },
      instruction: {
        ta: "வார்த்தைகளை இழுத்து விடுங்கள்",
        en: "Drag and drop the words",
        si: "වචන ගෙනයා දමන්න"
      },
      sentences: [
        {
          id: "1",
          text: {
            ta: "நான் ___ பள்ளிக்கூடம் போகிறேன்",
            en: "I go to ___ school",
            si: "මම ___ පාසලට යනවා"
          },
          correctWord: {
            ta: "என்",
            en: "my",
            si: "මගේ"
          }
        }
      ],
      wordChoices: [
        {
          id: "1",
          text: {
            ta: "என்",
            en: "my",
            si: "මගේ"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 35: DragDropTextSort
  private static getDragDropTextSortTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு உரை வரிசைப்படுத்துதல்",
        en: "Drag Drop Text Sort",
        si: "ගෙනයා දමන පෙළ වර්ග කිරීම"
      },
      instruction: {
        ta: "உரையை சரியான வரிசையில் வைக்கவும்",
        en: "Arrange the text in correct order",
        si: "පෙළ නිවැරදි අනුපිළිවෙලට සකස් කරන්න"
      },
      textSegments: [
        {
          id: "1",
          text: {
            ta: "ஒரு காலத்தில்",
            en: "Once upon a time",
            si: "කලකට පෙර"
          },
          order: 1
        },
        {
          id: "2",
          text: {
            ta: "ஒரு சிறிய கிராமத்தில்",
            en: "in a small village",
            si: "කුඩා ගමක"
          },
          order: 2
        }
      ]
    }, null, 2);
  }

  // Activity Type 36: MultiDragDropFillInBlank
  private static getMultiDragDropFillInBlankTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பல இழுத்து விடு வெற்றிட நிரப்புதல்",
        en: "Multi Drag Drop Fill in Blank",
        si: "බහු ගෙනයා දමන හිස් පුරවීම"
      },
      instruction: {
        ta: "பல வார்த்தைகளை இழுத்து விடுங்கள்",
        en: "Drag and drop multiple words",
        si: "බහු වචන ගෙනයා දමන්න"
      },
      sentences: [
        {
          id: "1",
          text: {
            ta: "நான் ___ ___ பள்ளிக்கூடம் போகிறேன்",
            en: "I go to ___ ___ school",
            si: "මම ___ ___ පාසලට යනවා"
          },
          blanks: [
            {
              position: 1,
              correctWord: {
                ta: "என்",
                en: "my",
                si: "මගේ"
              }
            },
            {
              position: 2,
              correctWord: {
                ta: "புதிய",
                en: "new",
                si: "නව"
              }
            }
          ]
        }
      ],
      wordChoices: [
        {
          id: "1",
          text: {
            ta: "என்",
            en: "my",
            si: "මගේ"
          }
        },
        {
          id: "2",
          text: {
            ta: "புதிய",
            en: "new",
            si: "නව"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 37: HighlightingActivity
  private static getHighlightingActivityTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "முன்னிலைப்படுத்துதல் செயல்பாடு",
        en: "Highlighting Activity",
        si: "ඉස්මතු කිරීමේ ක්‍රියාකාරකම"
      },
      instruction: {
        ta: "உரையில் முக்கியமான பகுதிகளை முன்னிலைப்படுத்தவும்",
        en: "Highlight important parts in the text",
        si: "පෙළේ වැදගත් කොටස් ඉස්මතු කරන්න"
      },
      text: {
        ta: "இது ஒரு உதாரண உரை. முக்கியமான வார்த்தைகளை முன்னிலைப்படுத்தவும்.",
        en: "This is an example text. Highlight the important words.",
        si: "මෙය උදාහරණ පෙළකි. වැදගත් වචන ඉස්මතු කරන්න."
      },
      highlightableWords: [
        {
          id: "1",
          text: {
            ta: "முக்கியமான",
            en: "important",
            si: "වැදගත්"
          },
          isCorrect: true
        }
      ]
    }, null, 2);
  }

  // Activity Type 38: WordSplitter
  private static getWordSplitterTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொல் பிரிப்பான்",
        en: "Word Splitter",
        si: "වචන බෙදන්නා"
      },
      instruction: {
        ta: "சொற்களை சரியான பகுதிகளாகப் பிரிக்கவும்",
        en: "Split the words into correct parts",
        si: "වචන නිවැරදි කොටස් වලට බෙදන්න"
      },
      words: [
        {
          id: "1",
          complete: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          parts: ["அ", "ம்மா"],
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 39: DropdownCompletion
  private static getDropdownCompletionTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "கீழ்விழும் பட்டியல் நிறைவு",
        en: "Dropdown Completion",
        si: "ඩ්‍රොප්ඩවුන් සම්පූර්ණ කිරීම"
      },
      instruction: {
        ta: "கீழ்விழும் பட்டியலில் இருந்து சரியான வார்த்தையைத் தேர்ந்தெடுக்கவும்",
        en: "Choose the correct word from the dropdown",
        si: "ඩ්‍රොප්ඩවුන් වලින් නිවැරදි වචනය තෝරන්න"
      },
      sentences: [
        {
          id: "1",
          text: {
            ta: "நான் ___ பள்ளிக்கூடம் போகிறேன்",
            en: "I go to ___ school",
            si: "මම ___ පාසලට යනවා"
          },
          options: [
            {
              id: "1",
              text: {
                ta: "என்",
                en: "my",
                si: "මගේ"
              },
              isCorrect: true
            },
            {
              id: "2",
              text: {
                ta: "உன்",
                en: "your",
                si: "ඔබේ"
              },
              isCorrect: false
            }
          ]
        }
      ]
    }, null, 2);
  }

  // Activity Type 40: TrueFalseQuiz
  private static getTrueFalseQuizTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "உண்மை பொய் வினாடி வினா",
        en: "True False Quiz",
        si: "සත්‍ය අසත්‍ය ප්‍රශ්නාවලිය"
      },
      instruction: {
        ta: "கூற்றுகள் உண்மையா பொய்யா என்பதைத் தேர்ந்தெடுக்கவும்",
        en: "Choose whether the statements are true or false",
        si: "කියමන් සත්‍යද අසත්‍යද යන්න තෝරන්න"
      },
      statements: [
        {
          id: "1",
          statement: {
            ta: "சூரியன் கிழக்கில் உதிக்கிறது",
            en: "The sun rises in the east",
            si: "සූර්යයා නැගෙනහිරින් නැගෙයි"
          },
          isTrue: true,
          explanation: {
            ta: "சூரியன் எப்போதும் கிழக்கில் உதிக்கிறது",
            en: "The sun always rises in the east",
            si: "සූර්යයා සැමවිටම නැගෙනහිරින් නැගෙයි"
          },
          audioUrl: {
            ta: "/audio/ta/statement1.mp3",
            en: "/audio/en/statement1.mp3",
            si: "/audio/si/statement1.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 41: ImageWordMatch
  private static getImageWordMatchTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "படம் சொல் பொருத்துதல்",
        en: "Image Word Match",
        si: "රූප වචන ගැලපීම"
      },
      instruction: {
        ta: "படங்களுடன் சரியான சொற்களைப் பொருத்தவும்",
        en: "Match the images with correct words",
        si: "රූප සමඟ නිවැරදි වචන ගැලපීම"
      },
      items: [
        {
          id: "1",
          imageUrl: "/images/book.png",
          word: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          audioUrl: {
            ta: "/audio/ta/book.mp3",
            en: "/audio/en/book.mp3",
            si: "/audio/si/book.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 42: SoundImageMatch
  private static getSoundImageMatchTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "ஒலி படம் பொருத்துதல்",
        en: "Sound Image Match",
        si: "ශබ්ද රූප ගැලපීම"
      },
      instruction: {
        ta: "ஒலியைக் கேட்டு சரியான படத்தைப் பொருத்தவும்",
        en: "Listen to the sound and match the correct image",
        si: "ශබ්දය අසා නිවැරදි රූපය ගැලපීම"
      },
      items: [
        {
          id: "1",
          imageUrl: "/images/cat.png",
          soundUrl: "/audio/cat.mp3",
          word: {
            ta: "பூனை",
            en: "Cat",
            si: "පූසා"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 44: PositionalSceneBuilder
  private static getPositionalSceneBuilderTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இட நிலை காட்சி கட்டமைப்பான்",
        en: "Positional Scene Builder",
        si: "ස්ථානීය දර්ශන ගොඩනැගීම"
      },
      instruction: {
        ta: "பொருட்களை சரியான இடத்தில் வைக்கவும்",
        en: "Place the objects in correct positions",
        si: "වස්තු නිවැරදි ස්ථානවල තබන්න"
      },
      sceneImageUrl: "/images/scene.png",
      objects: [
        {
          id: "1",
          name: {
            ta: "மேசை",
            en: "Table",
            si: "මේසය"
          },
          imageUrl: "/images/table.png",
          correctPosition: {
            x: 50,
            y: 60
          },
          audioUrl: {
            ta: "/audio/ta/table.mp3",
            en: "/audio/en/table.mp3",
            si: "/audio/si/table.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 46: DragDropCategorization
  private static getDragDropCategorizationTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "இழுத்து விடு வகைப்படுத்துதல்",
        en: "Drag Drop Categorization",
        si: "ගෙනයා දමන වර්ගීකරණය"
      },
      instruction: {
        ta: "பொருட்களை சரியான வகைகளில் வைக்கவும்",
        en: "Place the objects in correct categories",
        si: "වස්තු නිවැරදි කාණ්ඩවල තබන්න"
      },
      words: [
        {
          id: "1",
          text: {
            ta: "பூ",
            en: "Flower",
            si: "මල"
          },
          category: {
            ta: "தாவரங்கள்",
            en: "Plants",
            si: "ශාක"
          }
        }
      ],
      categories: [
        {
          id: "1",
          title: {
            ta: "தாவரங்கள்",
            en: "Plants",
            si: "ශාක"
          }
        },
        {
          id: "2",
          title: {
            ta: "விலங்குகள்",
            en: "Animals",
            si: "සතුන්"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 47: LetterSpotlight
  private static getLetterSpotlightTemplate(): string {
    return JSON.stringify({
      spotlightLetter: "அ",
      instruction: {
        ta: "எழுத்து 'அ' ஐ முன்னிலைப்படுத்தும் சொற்களைக் கண்டறியவும்",
        en: "Find words that highlight the letter 'அ'",
        si: "'අ' අකුර ඉස්මතු කරන වචන සොයන්න"
      },
      words: [
        {
          text: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          imageUrl: "/images/mother.png",
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 48: WordBankCompletion
  private static getWordBankCompletionTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "சொல் வங்கி நிறைவு",
        en: "Word Bank Completion",
        si: "වචන බැංකු සම්පූර්ණ කිරීම"
      },
      instruction: {
        ta: "சொல் வங்கியில் இருந்து சரியான வார்த்தைகளைத் தேர்ந்தெடுக்கவும்",
        en: "Choose the correct words from the word bank",
        si: "වචන බැංකුවෙන් නිවැරදි වචන තෝරන්න"
      },
      sentences: [
        {
          id: "1",
          text: {
            ta: "நான் ___ பள்ளிக்கூடம் ___",
            en: "I go to ___ school ___",
            si: "මම ___ පාසලට ___"
          },
          blanks: [
            {
              position: 1,
              correctWord: {
                ta: "என்",
                en: "my",
                si: "මගේ"
              }
            },
            {
              position: 2,
              correctWord: {
                ta: "போகிறேன்",
                en: "every day",
                si: "දිනපතා"
              }
            }
          ]
        }
      ],
      wordBank: [
        {
          id: "1",
          text: {
            ta: "என்",
            en: "my",
            si: "මගේ"
          }
        },
        {
          id: "2",
          text: {
            ta: "போகிறேன்",
            en: "every day",
            si: "දිනපතා"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 49: FirstLetterMatch
  private static getFirstLetterMatchTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "முதல் எழுத்து பொருத்துதல்",
        en: "First Letter Match",
        si: "පළමු අකුර ගැලපීම"
      },
      instruction: {
        ta: "சொற்களின் முதல் எழுத்துகளைப் பொருத்தவும்",
        en: "Match the first letters of words",
        si: "වචනවල පළමු අකුරු ගැලපීම"
      },
      words: [
        {
          id: "1",
          word: {
            ta: "அம்மா",
            en: "Mother",
            si: "අම්මා"
          },
          firstLetter: "அ",
          imageUrl: "/images/mother.png",
          audioUrl: {
            ta: "/audio/ta/mother.mp3",
            en: "/audio/en/mother.mp3",
            si: "/audio/si/mother.mp3"
          }
        }
      ]
    }, null, 2);
  }

  // Activity Type 50: Highlight
  private static getHighlightTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "முன்னிலைப்படுத்துதல்",
        en: "Highlight",
        si: "ඉස්මතු කිරීම"
      },
      instruction: {
        ta: "உரையில் முக்கியமான பகுதிகளை முன்னிலைப்படுத்தவும்",
        en: "Highlight important parts in the text",
        si: "පෙළේ වැදගත් කොටස් ඉස්මතු කරන්න"
      },
      text: {
        ta: "இது ஒரு உதாரண உரை. முக்கியமான வார்த்தைகளை முன்னிலைப்படுத்தவும்.",
        en: "This is an example text. Highlight the important words.",
        si: "මෙය උදාහරණ පෙළකි. වැදගත් වචන ඉස්මතු කරන්න."
      },
      highlightableWords: [
        {
          id: "1",
          text: {
            ta: "முக்கியமான",
            en: "important",
            si: "වැදගත්"
          },
          isCorrect: true
        }
      ]
    }, null, 2);
  }

  // Activity Type 51: Matching
  private static getMatchingTemplate(): string {
    return JSON.stringify({
      title: {
        ta: "பொருத்துதல்",
        en: "Matching",
        si: "ගැලපීම"
      },
      instruction: {
        ta: "சரியான ஜோடிகளைப் பொருத்தவும்",
        en: "Match the correct pairs",
        si: "නිවැරදි යුගල ගැලපීම"
      },
      columnA: [
        {
          id: "1",
          content: {
            ta: "புத்தகம்",
            en: "Book",
            si: "පොත"
          },
          matchId: "1"
        }
      ],
      columnB: [
        {
          id: "1",
          content: {
            ta: "படித்தல்",
            en: "Reading",
            si: "කියවීම"
          }
        }
      ]
    }, null, 2);
  }
}
