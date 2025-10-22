// This file stores the boilerplate JSON for each activity type

export const getActivityTemplate = (activityTypeId: number): string => {
  const templates: Record<number, object> = {
    1: { // FlashCards
      title: "உடல் உறுப்புகள் (Body Parts)",
      word: "காது",
      imageUrl: "/malaiyar/lesson1/kan.png",
      audioUrl: "/malaiyar/lesson1/kan.mp3"
    },
    2: {
      "title": "'க்' சொற்கள்",
      "spotlightLetter": "க்",
      "items": [
        {
          "text": "கொக்கு",
          "imageUrl": "siruvar/lesson5/kokku.jpg",
          "audioUrl": "siruvar/lesson5/kokku.mp3"
        },
        {
          "text": "பாக்கு",
          "imageUrl": "siruvar/lesson5/paakku.jpg",
          "audioUrl": "siruvar/lesson5/paakku.mp3"
        },
        {
          "text": "தக்காளி",
          "imageUrl": "siruvar/lesson5/thakkali.jpg",
          "audioUrl": "siruvar/lesson5/thakkali.mp3"
        }
      ],
    },
    3: {
      "title": "'அ' வில் தொடங்கும் சொற்கள்",
      "spotlightLetter": "அ",
      "item": {
        "text": "அம்மா",
        "imageUrl": "malaiyar/lesson1/amma.png",
        "audioUrl": "malaiyar/lesson1/amma.mp3"
      }
    },
    4: { // Equation
      leftOperand: "க்",
      rightOperand: "அ",
      correctAnswer: "க",
      options: ["கா", "கி", "க", "கூ"]
    },
    5: {
      "title": "At the Market",
      "audioUrl": "https://your-bucket.../market_conversation.mp3",
      "messages": [
        {
          "speaker": "Seller",
          "avatar": "https://.../seller_avatar.png",
          "text": "வணக்கம்! என்ன வேண்டும்?",
          "timestamp": 0.5
        },
        {
          "speaker": "Buyer",
          "avatar": "https://.../buyer_avatar.png",
          "text": "எனக்கு ஒரு கிலோ தக்காளி வேண்டும்.",
          "timestamp": 3.2
        },
        {
          "speaker": "Seller",
          "text": "சரி, இதோ இருக்கிறது. வேறு என்ன வேண்டும்?",
          "timestamp": 6.8
        },
        {
          "speaker": "Buyer",
          "text": "போதும், நன்றி. எவ்வளவு?",
          "timestamp": 10.1
        }
      ],
    },
    6: {
      "title": "நிலா நிலா ஓடி வா",
      "artist": "Traditional",
      "albumArtUrl": "https://your-bucket.../nila_nila_album_art.jpg",
      "audioUrl": "https://your-bucket.../nila_nila_odi_vaa.mp3",
      "lyrics": [
        { "text": "நிலா நிலா ஓடி வா", "timestamp": 2.5 },
        { "text": "நில்லாமல் ஓடி வா", "timestamp": 5.0 },
        { "text": "மலை மேலே ஏறி வா", "timestamp": 7.8 },
        { "text": "மல்லிகைப் பூ கொண்டு வா", "timestamp": 10.5 }
      ]
    },
    7: {  // RecognitionGrid
      "title": "Find the picture that matches the sound",
      "gridItems": [
        { "id": 1, "imageUrl": "...", "audioUrl": ".../pal.mp3" },      // பல்
        { "id": 2, "imageUrl": "...", "audioUrl": ".../kal.mp3" },      // கல்
        { "id": 3, "imageUrl": "...", "audioUrl": ".../kan.mp3" },      // கண்
        { "id": 4, "imageUrl": "...", "audioUrl": ".../maram.mp3" },    // மரம்
        { "id": 5, "imageUrl": "...", "audioUrl": ".../vattam.mp3" },   // வட்டம்
        { "id": 6, "imageUrl": "...", "audioUrl": ".../naram.mp3" }     // நகரம்
      ],
      "correctItemIds": [1, 2, 3] // The user must find பல், கல், and கண் on this page
    },
    8: { // CharacterGrid
      "title": "Find the letter that matches the sound",
      "gridItems": [
        { "id": 1, "character": "க", "audioUrl": ".../ka.mp3" },
        { "id": 2, "character": "ங", "audioUrl": ".../nga.mp3" },
        { "id": 3, "character": "ச", "audioUrl": ".../sa.mp3" },
        // ... and so on for all 18 letters
      ],
      "correctItemIds": [1, 2, 3] // The user must find all of them
    },
    9: {// WordPairMCQ
      "title": "Listen to the sound and choose the correct word",
      "questions": [
        {
          "id": 1,
          "promptAudioUrl": ".../paal_sound.mp3",
          "choices": ["பல்", "பால்"],
          "correctAnswer": "பால்"
        },
        {
          "id": 2,
          "promptAudioUrl": ".../aram_sound.mp3",
          "choices": ["அரம்", "ஆரம்"],
          "correctAnswer": "அரம்"
        },
        {
          "id": 3,
          "promptAudioUrl": ".../kaal_sound.mp3",
          "choices": ["கல்", "கால்"],
          "correctAnswer": "கால்"
        }
        // ... and so on for all word pairs
      ]
    },
    10: { // word finder - SINGLE CHALLENGE (new way)
      "title": "Find words with letter ல்",
      "targetLetter": "ல்",
      "wordGrid": ["பல்", "கல்", "கண்", "மண்", "வயல்", "மரம்", "படம்", "தடம்", "அப்பம்", "வள்ளம்"],
      "correctWords": ["பல்", "கல்", "வயல்", "வள்ளம்"]
    },
    11: { // Scene Finder
      "title": "Find the items on the farm",
      "sceneImageUrl": "https://your-bucket.../farm_scene.jpg",
      "hotspots": [
        {
          "id": 1, "name": "ஆடு", "audioUrl": ".../aadu_find.mp3",
          "x": 60, "y": 70, "width": 15, "height": 15
        },
        {
          "id": 2, "name": "குதிரை", "audioUrl": ".../kuthirai_find.mp3",
          "x": 20, "y": 55, "width": 25, "height": 30
        },
        {
          "id": 3, "name": "சேவல்", "audioUrl": ".../seval_find.mp3",
          "x": 80, "y": 40, "width": 10, "height": 10
        },
        {
          "id": 4, "name": "வைக்கோல்", "audioUrl": ".../vaikkol_find.mp3",
          "x": 5, "y": 75, "width": 20, "height": 15
        }
      ]
    },
    12: { // story player
      "title": "The Thirsty Crow",
      "audioUrl": "https://your-bucket.../thirsty_crow_narration.mp3",
      "scenes": [
        {
          "imageUrl": "https://your-bucket.../crow_sees_pot.jpg",
          "text": "ஒரு காகம் மிகவும் தாகமாக இருந்தது. அது தண்ணீரைத் தேடி எல்லா இடங்களிலும் பறந்தது.",
          "timestamp": 0.5
        },
        {
          "imageUrl": "https://your-bucket.../crow_finds_pebbles.jpg",
          "text": "திடீரென்று, அது ஒரு பானையைக் கண்டது. ஆனால் பானையில் தண்ணீர் குறைவாகவே இருந்தது.",
          "timestamp": 8.2
        },
        {
          "imageUrl": "https://your-bucket.../crow_drops_pebbles.jpg",
          "text": "காகம் யோசித்தது. அது அருகிலிருந்த கூழாங்கற்களை எடுத்து பானையில் போட்டது.",
          "timestamp": 15.6
        },
        {
          "imageUrl": "https://your-bucket.../crow_drinks_water.jpg",
          "text": "தண்ணீர் மட்டம் உயர்ந்தது. காகம் மகிழ்ச்சியுடன் தண்ணீரைக் குடித்தது.",
          "timestamp": 23.0
        }
      ]
    },
    13: {
      "id": 1,
      "title": "Select the Dog",
      "audioUrl": "https://your-bucket.../dog_sound.mp3",
      "options": [
        {
          "id": "1",
          "imageUrl": "https://your-bucket.../dog_image.jpg",
          "isCorrect": true
        },
        {
          "id": "2",
          "imageUrl": "https://your-bucket.../cat_image.jpg",
          "isCorrect": false
        },
        {
          "id": "3",
          "imageUrl": "https://your-bucket.../rabbit_image.jpg",
          "isCorrect": false
        }
      ]
    },
    14: { // AudioTextImageSelection
      "title": "சரியான படத்தைத் தேர்ந்தெடுக்கவும்",
      "text": "பூனை",
      "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/malaiyar/lesson4/eetti.mp3",
      "images": [
        {
          "id": 1,
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/malaiyar/lesson4/eetti.jpg",
          "isCorrect": true
        },
        {
          "id": 2,
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/malaiyar/lesson4/eetti.jpg",
          "isCorrect": false
        }
      ]
    },
    15: { // DragDropImageMatching
      "title": "படங்களை பொருத்துக (Match the Images)",
      "images": [
        {
          "id": 1,
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/cat.jpg",
          "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/cat_sound.mp3",
          "matchId": 1
        },
        {
          "id": 2,
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/dog.jpg",
          "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/dog_sound.mp3",
          "matchId": 2
        },
        {
          "id": 3,
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/bird.jpg",
          "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/animals/bird_sound.mp3",
          "matchId": 3
        }
      ]
    },
    16:
    {
      "title": "பாடம் 1: விலங்குகள்",
      "description": "இந்த காணொளியில் விலங்குகளைப் பற்றி கற்போம்.",
      "videoUrl": "https://example.com/media/animals_lesson.mp4"
    },
    17:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 01",
      "instruction": "எழுத்துகளை அறிந்து சொற்களை உருவாக்குதல். கீழே கொடுக்கப்பட்டுள்ள எழுத்துகளிலிருந்து சரியானதை தேர்ந்தெடுத்து இடைவெளியை நிரப்புக.",
      "sentences": [
        "மூக்____",
        "சங்____",
        "பச்____",
        "குட____",
        "வண்____"
      ],
      "options": [
        "கு",
        "சை",
        "ம்",
        "டு",
        "லை",
        "பம்",
        "டம்",
        "சு"
      ],
      "solutions": [
        "கு",
        "கு",
        "சை",
        "ம்",
        "டு"
      ]
    },
    18: //LetterSoundMcq
    {
      "activityId": "TAMIL_MCQ_SOUND_IMAGE_01",
      "title": "செயல் 04: சரியான படத்தைத் தேர்ந்தெடுக்கவும்.",
      "description": "ஒலிக்கும் எழுத்துக்கான சரியான படத்தைக் கிளிக் செய்யவும்.",
      "questions": [
        {
          "id": 1,
          "questionAudioUrl": "/assets/sounds/ka.mp3",
          "correctAnswerId": 101,
          "options": [
            {
              "id": 101,
              "letter": "க",
              "imageUrl": "/assets/images/ka.png"
            },
            {
              "id": 102,
              "letter": "ம",
              "imageUrl": "/assets/images/ma.png"
            },
            {
              "id": 103,
              "letter": "த",
              "imageUrl": "/assets/images/tha.png"
            }
          ]
        }
      ]
    },

    19: //WordCategory
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 02",
      "instruction": "ஒரு/ஓர் வேறுபாட்டைக் காணக்கூடியவாறு சொற்களை ஒழுங்குபடுத்தல். கொடுக்கப்பட்டுள்ள சொற்களை சரியான வட்டத்தில் இழுத்துவிடவும்.",
      "categories": [
        {
          "id": "or",
          "title": "ஓர்"
        },
        {
          "id": "oru",
          "title": "ஒரு"
        }
      ],
      "words": [
        {
          "id": "word1",
          "text": "ஏணி",
          "category": "or"
        },
        {
          "id": "word2",
          "text": "எறும்பு",
          "category": "or"
        },
        {
          "id": "word3",
          "text": "ஆடு",
          "category": "or"
        },
        {
          "id": "word4",
          "text": "அன்னம்",
          "category": "or"
        },
        {
          "id": "word5",
          "text": "குழந்தை",
          "category": "oru"
        },
        {
          "id": "word6",
          "text": "வீடு",
          "category": "oru"
        },
        {
          "id": "word7",
          "text": "பூ",
          "category": "oru"
        },
        {
          "id": "word8",
          "text": "தாமரை",
          "category": "oru"
        },
        {
          "id": "word9",
          "text": "முயல்",
          "category": "oru"
        },
        {
          "id": "word10",
          "text": "கரடி",
          "category": "oru"
        },
        {
          "id": "word11",
          "text": "தவளை",
          "category": "oru"
        }
      ]
    },
    20: { // InteractiveImageLearning
      "title": "வீட்டில் உள்ள பொருட்கள் (Objects in the House)",
      "imageUrl": "learning/house_interior.jpg",
      "backgroundAudioUrl": "learning/house_ambient.mp3",
      "objects": [
        {
          "id": 1,
          "name": "மேஜை",
          "audioUrl": "learning/objects/table.mp3",
          "x": 30,
          "y": 40,
          "width": 25,
          "height": 20
        },
        {
          "id": 2,
          "name": "நாற்காலி",
          "audioUrl": "learning/objects/chair.mp3",
          "x": 15,
          "y": 50,
          "width": 15,
          "height": 25
        },
        {
          "id": 3,
          "name": "புத்தகம்",
          "audioUrl": "learning/objects/book.mp3",
          "x": 35,
          "y": 35,
          "width": 8,
          "height": 6
        },
        {
          "id": 4,
          "name": "விளக்கு",
          "audioUrl": "learning/objects/lamp.mp3",
          "x": 60,
          "y": 25,
          "width": 12,
          "height": 20
        },
        {
          "id": 5,
          "name": "கடிகாரம்",
          "audioUrl": "learning/objects/clock.mp3",
          "x": 75,
          "y": 15,
          "width": 10,
          "height": 10
        },
        {
          "id": 6,
          "name": "தொலைக்காட்சி",
          "audioUrl": "learning/objects/tv.mp3",
          "x": 50,
          "y": 20,
          "width": 20,
          "height": 15
        }
      ]
    },
    21:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 03",
      "instruction": "திரையில் தோன்றும் வடிவங்களை சரியான எழுத்துகளுடன் கோடிட்டு இணைக்கவும்.",
      "leftItems": [
        {
          "id": "left-a",
          "content": "அ"
        },
        {
          "id": "left-aa",
          "content": "ஆ"
        },
        {
          "id": "left-i",
          "content": "இ"
        },
        {
          "id": "left-ii",
          "content": "ஈ"
        },
        {
          "id": "left-u",
          "content": "உ"
        }
      ],
      "rightItems": [
        {
          "id": "right-a",
          "content": "அ"
        },
        {
          "id": "right-aa",
          "content": "ஆ"
        },
        {
          "id": "right-i",
          "content": "இ"
        },
        {
          "id": "right-ii",
          "content": "ஈ"
        },
        {
          "id": "right-u",
          "content": "உ"
        }
      ],
      "solutions": {
        "left-a": "right-a",
        "left-aa": "right-aa",
        "left-i": "right-i",
        "left-ii": "right-ii",
        "left-u": "right-u"
      }
    },
    22:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 04",
      "instruction": "கீழே கொடுக்கப்பட்டுள்ள எழுத்துக்களை சரியான முறையில் வரிசைப்படுத்தி சொற்களை உருவாக்கவும்.",
      "words": [
        {
          "id": "word1",
          "scrambled": ["மி", "ழ்", "த"],
          "solution": "தமிழ்"
        },
        {
          "id": "word2",
          "scrambled": ["ழி", "மொ"],
          "solution": "மொழி"
        },
        {
          "id": "word3",
          "scrambled": ["மை", "னி", "இ"],
          "solution": "இனிமை"
        },
        {
          "id": "word4",
          "scrambled": ["வ", "பு", "ல", "ர்"],
          "solution": "புலவர்"
        },
        {
          "id": "word5",
          "scrambled": ["டு", "வீ"],
          "solution": "வீடு"
        },
        {
          "id": "word6",
          "scrambled": ["டு", "ஆ"],
          "solution": "ஆடு"
        },
        {
          "id": "word7",
          "scrambled": ["வு", "உ", "ண"],
          "solution": "உணவு"
        },
        {
          "id": "word8",
          "scrambled": ["ய்", "தா"],
          "solution": "தாய்"
        },
        {
          "id": "word9",
          "scrambled": ["மை", "ழை", "ப"],
          "solution": "பழைமை"
        },
        {
          "id": "word10",
          "scrambled": ["வு", "அ", "றி"],
          "solution": "அறிவு"
        }
      ]
    },
    23: { // Letters Display
      "title": "தமிழ் உயிர் எழுத்துக்கள் (Tamil Vowels)",
      "description": "அ முதல் ஔ வரையிலான 12 உயிர் எழுத்துக்களைக் கற்றுக்கொள்ளுங்கள்",
      "introAudioUrl": "vowels/intro.mp3",
      "vowels": [
        {
          "id": 1,
          "letter": "அ",
          "romanization": "a",
          "audioUrl": "vowels/a.mp3"
        },
        {
          "id": 2,
          "letter": "ஆ",
          "romanization": "aa",
          "audioUrl": "vowels/aa.mp3"
        },
        {
          "id": 3,
          "letter": "இ",
          "romanization": "i",
          "audioUrl": "vowels/i.mp3"
        },
        {
          "id": 4,
          "letter": "ஈ",
          "romanization": "ii",
          "audioUrl": "vowels/ii.mp3"
        },
        {
          "id": 5,
          "letter": "உ",
          "romanization": "u",
          "audioUrl": "vowels/u.mp3"
        },
        {
          "id": 6,
          "letter": "ஊ",
          "romanization": "uu",
          "audioUrl": "vowels/uu.mp3"
        },
        {
          "id": 7,
          "letter": "எ",
          "romanization": "e",
          "audioUrl": "vowels/e.mp3"
        },
        {
          "id": 8,
          "letter": "ஏ",
          "romanization": "ee",
          "audioUrl": "vowels/ee.mp3"
        },
        {
          "id": 9,
          "letter": "ஐ",
          "romanization": "ai",
          "audioUrl": "vowels/ai.mp3"
        },
        {
          "id": 10,
          "letter": "ஒ",
          "romanization": "o",
          "audioUrl": "vowels/o.mp3"
        },
        {
          "id": 11,
          "letter": "ஓ",
          "romanization": "oo",
          "audioUrl": "vowels/oo.mp3"
        },
        {
          "id": 12,
          "letter": "ஔ",
          "romanization": "au",
          "audioUrl": "vowels/au.mp3"
        }
      ]
    },
    24: { // Equation Learn
      "title": "உயிர்மெய் எழுத்துக்கள் (Uyir-Mei Letters)",
      "description": "மெய்யும் உயிரும் சேர்ந்து உயிர்மெய் எழுத்து உருவாகுவதைக் கற்றுக்கொள்ளுங்கள்",
      "introAudioUrl": "uyirmei/intro.mp3",
      "equations": [
        {
          "id": 1,
          "consonant": "க்",
          "consonantAudioUrl": "uyirmei/consonants/k.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "க",
          "resultAudioUrl": "uyirmei/results/ka.mp3",
          "romanization": "ka"
        },
        {
          "id": 2,
          "consonant": "ங்",
          "consonantAudioUrl": "uyirmei/consonants/ng.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "ங",
          "resultAudioUrl": "uyirmei/results/nga.mp3",
          "romanization": "nga"
        },
        {
          "id": 3,
          "consonant": "ச்",
          "consonantAudioUrl": "uyirmei/consonants/ch.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "ச",
          "resultAudioUrl": "uyirmei/results/cha.mp3",
          "romanization": "cha"
        },
        {
          "id": 4,
          "consonant": "ஞ்",
          "consonantAudioUrl": "uyirmei/consonants/nj.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "ஞ",
          "resultAudioUrl": "uyirmei/results/nja.mp3",
          "romanization": "nja"
        },
        {
          "id": 5,
          "consonant": "த்",
          "consonantAudioUrl": "uyirmei/consonants/th.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "த",
          "resultAudioUrl": "uyirmei/results/tha.mp3",
          "romanization": "tha"
        },
        {
          "id": 6,
          "consonant": "ந்",
          "consonantAudioUrl": "uyirmei/consonants/nh.mp3",
          "vowel": "அ",
          "vowelAudioUrl": "uyirmei/vowels/a.mp3",
          "result": "ந",
          "resultAudioUrl": "uyirmei/results/nha.mp3",
          "romanization": "nha"
        }
      ]
    },
    25:
    {
      "title": "சொற்களை ஒழுங்குபடுத்துதல்",
      "activityTitle": "செயல் 05",
      "instruction": "கீழே கொடுக்கப்பட்டுள்ள சொற்களை சரியான முறையில் வரிசைப்படுத்தி வாக்கியங்களை உருவாக்கவும்.",
      "sentences": [
        {
          "id": "sent1",
          "scrambled": [
            "எங்கள்",
            "தமிழ்",
            "தாய்மொழி"
          ],
          "solution": "தமிழ் எங்கள் தாய்மொழி."
        },
        {
          "id": "sent2",
          "scrambled": [
            "தமிழர்",
            "நாங்கள்"
          ],
          "solution": "நாங்கள் தமிழர்."
        },
        {
          "id": "sent3",
          "scrambled": [
            "ஓர்",
            "மொழி",
            "தமிழ்",
            "இனிய"
          ],
          "solution": "தமிழ் ஓர் இனிய மொழி."
        },
        {
          "id": "sent4",
          "scrambled": [
            "தந்த",
            "மொழி",
            "சொல்லித்",
            "அன்னை"
          ],
          "solution": "அன்னை சொல்லித் தந்த மொழி."
        },
        {
          "id": "sent5",
          "scrambled": [
            "கற்ற",
            "பள்ளி",
            "மொழி",
            "சென்று"
          ],
          "solution": "பள்ளி சென்று கற்ற மொழி."
        }
      ]
    },
    26: { // Sentence Builder
      "id": 1,
      "title": "വാക്യം ഉണ്ടാക്കുക (Build the Sentence with 'ஐ')",
      "imageWord": {
        "text": "പഴം",
        "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/images/fruit.png",
        "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/pazham.mp3"
      },
      "suffix": {
        "text": "ஐ",
        "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/ai_suffix.mp3"
      },
      "predicate": {
        "text": "എടുത്തു",
        "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/eduthaan.mp3"
      },
      "fullSentenceText": "കുട്ടി പഴം എടുത്തു",
      "fullSentenceAudioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/sentence_boy_fruit.mp3"
    },
    27: { // WordsLearning - Multi-Activity Template
      "title": "சொற்கள் கற்றல்",
      "description": "பல பயிற்சிகளின் மூலம் சொற்களைக் கற்றுக்கொள்ளுங்கள்",
      "activities": [
        // ACTIVITY 1: Family Members - Contains multiple words
        {
          "id": 1,
          "title": "குடும்ப உறுப்பினர்கள்",
          "description": "குடும்ப உறுப்பினர்களின் பெயர்களைக் கற்றுக்கொள்ளுங்கள்",
          "words": [
            // Word 1 in Activity 1
            {
              "id": 1,
              "word": "அம்மா",
              "wordAudioUrl": "/assets/audio/words/amma_word.mp3",
              "letters": [
                {
                  "id": 1,
                  "letter": "அ",
                  "audioUrl": "/assets/audio/letters/a.mp3"
                },
                {
                  "id": 2,
                  "letter": "ம்",
                  "audioUrl": "/assets/audio/letters/m.mp3"
                },
                {
                  "id": 3,
                  "letter": "மா",
                  "audioUrl": "/assets/audio/letters/maa.mp3"
                }
              ]
            }
          ]
        }
      ]
    },
    28: {
      "id": 1,
      "title": "ஒலித்துப்பழகுவோம் (லகர, ளகர, ழகர)",
      "text": "பழம்",
      "audioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/pronunciation/pazham.mp3"
    },
    29: {
      "id": 1,
      "title": "நொடி (Riddle)",
      "riddleText": "அள்ள முடியும் கிள்ள முடியாத அது என்ன?",
      "riddleAudioUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/audio/riddles/riddle_water.mp3",
      "choices": [
        {
          "id": 101,
          "text": "தண்ணீர்",
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/images/riddles/water.png"
        },
        {
          "id": 102,
          "text": "பட்டம்",
          "imageUrl": "https://icedt-tamilapp-media.s3.dualstack.eu-north-1.amazonaws.com/images/riddles/kite.png"
        }
      ],
      "correctChoiceId": 101
    },
    30: {
      "title": "எழுத்து வழக்கை பேச்சு வழக்குடன் பொருத்தவும்",
      "targetTitle": "எழுத்துவழக்குச் சொற்கள் (Written Words)",
      "sourceTitle": "பேச்சுவழக்குச் சொற்கள் (Spoken Words)",
      "targets": [
        { "id": 1, "text": "ஓடுகிறான்" },
        { "id": 2, "text": "பறக்கிறது" },
        { "id": 3, "text": "ஆடுவாள்" },
        { "id": 4, "text": "அழுகிறேன்" },
        { "id": 5, "text": "குடிப்பேன்" }
      ],
      "sources": [
        { "id": 101, "text": "பறக்குது", "matchId": 2 },
        { "id": 102, "text": "குடிப்பன்", "matchId": 5 },
        { "id": 103, "text": "ஓடுறான்", "matchId": 1 },
        { "id": 104, "text": "ஆடுவள்", "matchId": 3 },
        { "id": 105, "text": "அழுகிறன்", "matchId": 4 }
      ]
    },
    31: {
      "title": "கேட்டல் : பூக்கள்",
      "passage": "பூக்களில் சிவப்பு, வெள்ளை, மஞ்சள் போன்ற பல வண்ணங்கள் உள்ளன. தாமரை நீரில் பூக்கும். காந்தள் நிலத்தில் பூக்கும். பூக்கள் மாலை கட்டுவதற்கு உதவும். தேனீக்கள் பூவில் தேனைக் குடிக்கும்.",
      "passageAudioUrl": "/audio/comprehension/flowers_passage.mp3",
      "questions": [
        {
          "id": 1,
          "text": "நீரில் பூக்கும் பூ எது?",
          "audioUrl": "/audio/comprehension/q_water_flower.mp3"
        },
        {
          "id": 2,
          "text": "பூக்கள் எதற்கு உதவும்?",
          "audioUrl": "/audio/comprehension/q_flowers_help.mp3"
        },
        {
          "id": 3,
          "text": "தேனைக் குடிப்பது எது?",
          "audioUrl": "/audio/comprehension/q_drinks_honey.mp3"
        },
        {
          "id": 4,
          "text": "பூக்களில் உள்ள வண்ணம் ஒன்று?",
          "audioUrl": "/audio/comprehension/q_flower_color.mp3"
        }
      ],
      "answers": [
        { "id": 101, "text": "தாமரை", "matchId": 1 },
        { "id": 102, "text": "மாலை", "matchId": 2 },
        { "id": 103, "text": "தேனீ", "matchId": 3 },
        { "id": 104, "text": "சிவப்பு", "matchId": 4 }
      ]
    },
    33: {
      "activityTitle": "சொற்றொடர்களுக்குப் பொருத்தமான சொற்களை எடுத்து வைப்போம்",
      "instruction": "கீழே உள்ள வாக்கியங்களுக்குப் பொருத்தமான சொற்களை வலதுபுறத்தில் உள்ள பெட்டியிலிருந்து சரியான காலி இடத்தில் இழுத்துவிடவும்.",
      "sentences": [
        {
          "id": "sentence1",
          "text": "சிந்தித்துச் செயல்படும் பகுத்தறிவு உடையவர்",
          "correctWordId": "word_manthar"
        },
        {
          "id": "sentence2",
          "text": "நன்றி மறவாமை",
          "correctWordId": "word_narpanbu"
        },
        {
          "id": "sentence3",
          "text": "உயிர்களிடத்தில் காட்டுவது",
          "correctWordId": "word_anbu"
        },
        {
          "id": "sentence4",
          "text": "உயிரினும் மேலானது",
          "correctWordId": "word_ozhukkam"
        },
        {
          "id": "sentence5",
          "text": "பொறுமை உடையவரிடம் சேராதது",
          "correctWordId": "word_selvam"
        },
        {
          "id": "sentence6",
          "text": "திருக்குறள், ஆத்திசூடி, கொன்றைவேந்தன் போன்றவை",
          "correctWordId": "word_aranoolgal"
        }
      ],
      "words": [
        {
          "id": "word_ozhukkam",
          "text": "ஒழுக்கம்"
        },
        {
          "id": "word_manthar",
          "text": "மாந்தர்"
        },
        {
          "id": "word_anbu",
          "text": "அன்பு"
        },
        {
          "id": "word_aranoolgal",
          "text": "அறநூல்கள்"
        },
        {
          "id": "word_narpanbu",
          "text": "நற்பண்பு"
        },
        {
          "id": "word_selvam",
          "text": "செல்வம்"
        }
      ]
    },
    34: {
      "id": 2,
      "title": "பொருத்தமான விடையைத் தெரிவு செய்க",
      "promptParts": ["", " மரத்தில் தாவின."],
      "choices":
        [
          { "id": "2a", "text": "குரங்கு" },
          { "id": "2b", "text": "குரங்குகள்" }
        ],
      "correctAnswer": "குரங்குகள்"
    },
    35: {
      "title": "குறில், நெடில் எழுத்துகளை சரியான கூண்டில் இடுக",
      "items": [
        { "id": "item-a", "text": "அ", "categoryId": "kuril" },
        { "id": "item-aa", "text": "ஆ", "categoryId": "nedil" },
        { "id": "item-i", "text": "இ", "categoryId": "kuril" },
        { "id": "item-ii", "text": "ஈ", "categoryId": "nedil" },
        { "id": "item-u", "text": "உ", "categoryId": "kuril" },
        { "id": "item-uu", "text": "ஊ", "categoryId": "nedil" },
        { "id": "item-e", "text": "எ", "categoryId": "kuril" },
        { "id": "item-ee", "text": "ஏ", "categoryId": "nedil" },
        { "id": "item-ai", "text": "ஐ", "categoryId": "nedil" },
        { "id": "item-o", "text": "ஒ", "categoryId": "kuril" },
        { "id": "item-oo", "text": "ஓ", "categoryId": "nedil" },
        { "id": "item-au", "text": "ஔ", "categoryId": "nedil" }
      ],
      "categories": [
        { "id": "kuril", "title": "குறில் எழுத்துகள்" },
        { "id": "nedil", "title": "நெடில் எழுத்துகள்" }
      ]
    },
    36: {
      "id": 1,
      "title": "பின்வரும் குறளை பூர்த்தி செய்க",
      "promptSegments": [
        { "type": "text", "content": "அன்பின் வழியது" },
        { "type": "blank", "content": "blank-1" },
        { "type": "text", "content": "அஃதிலார்க்கு" },
        { "type": "blank", "content": "blank-2" },
        { "type": "text", "content": "போர்த்த உடம்பு" }
      ],
      "choices": [
        { "id": "choice-a", "text": "உயிர்நிலை" },
        { "id": "choice-b", "text": "என்புதோல்" }
      ],
      "correctAnswers": {
        "blank-1": "உயிர்நிலை",
        "blank-2": "என்புதோல்"
      }
    },

    37: {
      "title": "Unit 6",

      "instruction": "வாக்கியங்களில் உள்ள எழுவாய், செயப்படுபொருள், மற்றும் பயனிலையை சரியான நிறத்தைக் கொண்டு அடையாளப்படுத்துக.",
      "categories": [
        {
          "id": "subject",
          "label": "எழுவாய்",
          "color": "#FF9800"
        },
        {
          "id": "object",
          "label": "செயப்படுபொருள்",
          "color": "#4CAF50"
        },
        {
          "id": "verb",
          "label": "பயனிலை",
          "color": "#2196F3"
        }
      ],
      "sentences": [
        {
          "id": "sentence1",
          "text": "கண்ணகி கையில் சிலம்பை வைத்திருந்தாள்.",
          "parts": [
            { "text": "கண்ணகி", "type": "subject" },
            { "text": "சிலம்பை", "type": "object" },
            { "text": "வைத்திருந்தாள்", "type": "verb" }
          ]
        }
      ]
    },
    38: {
      "id": 1,
      "title": "பிரித்து எழுதுக!",
      "compoundWord": "மலர்த்தொட்டி",
      "choices": [
        { "id": "c1", "text": "மலர்" }, { "id": "c2", "text": "மரம்" }, { "id": "c3", "text": "சோலை" },
        { "id": "c4", "text": "தொட்டி" }, { "id": "c5", "text": "கொடி" }, { "id": "c6", "text": "கலம்" },
        { "id": "c7", "text": "பூ" }, { "id": "c8", "text": "திசை" }, { "id": "c9", "text": "முல்லை" },
        { "id": "c10", "text": "எட்டு" }
      ],
      "correctAnswers": ["மலர்", "தொட்டி"]
    },
    40: {
      "id": 1,
      "title": "தமிழ்மொழி மற்றும் இலக்கியம்",
      "questions": [
        {
          "id": 1,
          "statement": "தமிழ்மொழி மிகத் தொன்மையானது.",
          "isCorrect": true
        },
        {
          "id": 2,
          "statement": "தமிழ்மொழி இலக்கியவளம் குறைந்தது.",
          "isCorrect": false
        },
        {
          "id": 3,
          "statement": "இயல், இசை, நாடகம் என்பன முத்தமிழ்.",
          "isCorrect": true
        },
        {
          "id": 4,
          "statement": "சிலப்பதிகாரம் பழந்தமிழர் வரலாற்றையும் பண்பாட்டையும் கூறுகிறது.",
          "isCorrect": true
        },
        {
          "id": 5,
          "statement": "அறம், பொருள், இன்பம் என்பன முக்கனி.",
          "isCorrect": false
        },
        {
          "id": 6,
          "statement": "தமிழை தாய்மொழியாகக் கொண்டோர் தமிழர்.",
          "isCorrect": true
        },
        {
          "id": 7,
          "statement": "பழைமையான தமிழ் இலக்கியங்களில் ஒன்று நாலடியார்.",
          "isCorrect": true
        },
        {
          "id": 8,
          "statement": "திருக்குறள் நான்கு அடிகளைக் கொண்டது.",
          "isCorrect": false
        }
      ]
    },
    41: {
      "title": "விலங்குகளும் அவற்றின் ஒலிகளும்",
      "prompts": [
        { "id": 1, "name": "நரி", "imageUrl": "/images/animals/fox.png" },
        { "id": 2, "name": "பசு", "imageUrl": "/images/animals/cow.png" },
        { "id": 3, "name": "யானை", "imageUrl": "/images/animals/elephant.png" },
        { "id": 4, "name": "பாம்பு", "imageUrl": "/images/animals/snake.png" },
        { "id": 5, "name": "நாய்", "imageUrl": "/images/animals/dog.png" },
        { "id": 6, "name": "பூனை", "imageUrl": "/images/animals/cat.png" }
      ],
      "answers": [
        { "id": 101, "text": "ஊளையிடும்", "matchId": 1 },
        { "id": 102, "text": "கதறும்", "matchId": 2 },
        { "id": 103, "text": "பிளிறும்", "matchId": 3 },
        { "id": 104, "text": "சீறும்", "matchId": 4 },
        { "id": 105, "text": "குரைக்கும்", "matchId": 5 },
        { "id": 106, "text": "கத்தும்", "matchId": 6 }
      ]
    },
    42: {
      "title": "விலங்குகளின் ஒலிகளை படத்துடன் இணைக்க",
      "imageTargets": [
        { "id": 1, "name": "குதிரை", "imageUrl": "/images/animals/horse.png" },
        { "id": 2, "name": "பூனை", "imageUrl": "/images/animals/cat.png" },
        { "id": 3, "name": "சிங்கம்", "imageUrl": "/images/animals/lion.png" },
        { "id": 4, "name": "நாய்", "imageUrl": "/images/animals/dog.png" },
        { "id": 5, "name": "யானை", "imageUrl": "/images/animals/elephant.png" },
        { "id": 6, "name": "நரி", "imageUrl": "/images/animals/fox.png" }
      ],
      "soundSources": [
        { "id": 101, "text": "கனைக்கும்", "audioUrl": "/audio/sounds/neigh.mp3", "matchId": 1 },
        { "id": 102, "text": "கத்தும்", "audioUrl": "/audio/sounds/meow.mp3", "matchId": 2 },
        { "id": 103, "text": "முழங்கும்", "audioUrl": "/audio/sounds/roar.mp3", "matchId": 3 },
        { "id": 104, "text": "குரைக்கும்", "audioUrl": "/audio/sounds/bark.mp3", "matchId": 4 },
        { "id": 105, "text": "பிளிறும்", "audioUrl": "/audio/sounds/trumpet.mp3", "matchId": 5 },
        { "id": 106, "text": "ஊளையிடும்", "audioUrl": "/audio/sounds/howl.mp3", "matchId": 6 }
      ]
    },

    43: {
      "activityTitle": "தரப்பட்ட படத்துக்கேற்ப சொற்றொடர்களை ஒழுங்குபடுத்துக.",
      "instruction": "கீழே கொடுக்கப்பட்டுள்ள வாக்கியங்களை படத்திற்கேற்ப சரியான வரிசையில் இழுத்து, numerated பெட்டிகளில் விடவும்.",
      "imageUrl": "/path/to/your/image.png",
      "sentences": [
        {
          "id": "sent1",
          "text": "அவர்கள் ஒரு மரக்கன்றைக் கொண்டுவந்து தோட்டத்தில் நட்டனர்.",
          "correctOrder": 2
        },
        {
          "id": "sent2",
          "text": "ஒரு நாள் மகிழினியும் தம்பியும் தோட்டத்துக்குச் சென்றார்கள்.",
          "correctOrder": 1
        },
        {
          "id": "sent3",
          "text": "அப்போது தம்பி மண் போட்டு வேர்ப் பகுதியை மூடினான்.",
          "correctOrder": 3
        },
        {
          "id": "sent4",
          "text": "அங்கே மரங்களும் செடிகளும் பூக்களும் காணப்பட்டன.",
          "correctOrder": 4
        },
        {
          "id": "sent5",
          "text": "மகிழினி நட்ட மரக்கன்றுக்குத் தண்ணீர் ஊற்றினாள்.",
          "correctOrder": 5
        },
        {
          "id": "sent6",
          "text": "தங்களும் மரம் நட்டு வளர்க்க வேண்டுமென முடிவெடுத்தனர்.",
          "correctOrder": 6
        },
        {
          "id": "sent7",
          "text": "அவற்றைப் பார்த்த இருவருக்கும் ஓர் எண்ணம் தோன்றியது.",
          "correctOrder": 7
        }
      ]
    },
    44: {
      "title": "மேலே, கீழே, உள்ளே, வெளியே வேறுபாடுகளை அறிக",
      "sceneImageUrl": "/images/scenes/room_with_table.png",
      "draggableObjects": [
        { "id": "basket", "name": "கூடை", "imageUrl": "/images/objects/basket.png" },
        { "id": "box", "name": "பெட்டி", "imageUrl": "/images/objects/box.png" },
        { "id": "fruit", "name": "செந்தாழைப்பழம்", "imageUrl": "/images/objects/fruit.png" },
        { "id": "flower", "name": "கார்த்திகைப்பூ", "imageUrl": "/images/objects/flower.png" },
        { "id": "boy", "name": "சிறுவன்", "imageUrl": "/images/objects/boy.png" },
        { "id": "grandfather", "name": "தாத்தா", "imageUrl": "/images/objects/grandfather.png" }
      ],
      "dropZones": [
        { "id": "zone-on-table", "name": "On Table", "x": 40, "y": 30, "width": 20, "height": 15 },
        { "id": "zone-under-table", "name": "Under Table", "x": 40, "y": 70, "width": 20, "height": 15 },
        { "id": "zone-in-basket", "name": "In Basket", "x": 45, "y": 32, "width": 10, "height": 8 },
        { "id": "zone-outside-basket", "name": "Outside Basket", "x": 25, "y": 35, "width": 15, "height": 15 },
        { "id": "zone-near-table", "name": "Near Table", "x": 70, "y": 60, "width": 15, "height": 25 },
        { "id": "zone-far-from-table", "name": "Far from Table", "x": 10, "y": 60, "width": 15, "height": 25 }
      ],
      "instructions": [
        {
          "id": 1,
          "text": "கூடையை மேசையின் மேலே வைக்கவும்.",
          "audioUrl": "/audio/instructions/basket_on_table.mp3",
          "draggableObjectId": "basket",
          "dropZoneId": "zone-on-table"
        },
        {
          "id": 2,
          "text": "பெட்டியை மேசையின் கீழே வைக்கவும்.",
          "audioUrl": "/audio/instructions/box_under_table.mp3",
          "draggableObjectId": "box",
          "dropZoneId": "zone-under-table"
        },
        {
          "id": 3,
          "text": "செந்தாழைப்பழத்தைக் கூடைக்கு உள்ளே வைக்கவும்.",
          "audioUrl": "/audio/instructions/fruit_in_basket.mp3",
          "draggableObjectId": "fruit",
          "dropZoneId": "zone-in-basket"
        },
        {
          "id": 4,
          "text": "கார்த்திகைப்பூவை கூடைக்கு வெளியில் வைக்கவும்.",
          "audioUrl": "/audio/instructions/flower_outside_basket.mp3",
          "draggableObjectId": "flower",
          "dropZoneId": "zone-outside-basket"
        },
        {
          "id": 5,
          "text": "மேசைக்கு அருகில் சிறுவன் நிற்கிறான்.",
          "audioUrl": "/audio/instructions/boy_near_table.mp3",
          "draggableObjectId": "boy",
          "dropZoneId": "zone-near-table"
        },
        {
          "id": 6,
          "text": "மேசைக்கு தொலைவில் தாத்தா இருக்கிறார்.",
          "audioUrl": "/audio/instructions/grandfather_far_from_table.mp3",
          "draggableObjectId": "grandfather",
          "dropZoneId": "zone-far-from-table"
        }
      ]
    },
    45: {
      "title": "காபி தயாரிப்பது எப்படி?",
      "introduction": "கீழே தரப்பட்டுள்ள சொற்றொடர்களைக் கவனமாகக் கேளுங்கள். கேட்ட பிறகு, சொற்றொடர்களுக்கு உரிய சரியான படங்களை (சொற்களை) எடுத்து வையுங்கள். ஒரு முறை மட்டுமே ஆடியோ ஒலிக்கும்.",
      "sentences": [
        {
          "id": "sent1",
          "preBlankText": "சமையலறையின் மேலே",
          "postBlankText": "வைக்கவும்.",
          "audioUrl": "/path/to/audio/sentence1.mp3",
          "correctWordId": "word_coffee"
        },
        {
          "id": "sent2",
          "preBlankText": "பெட்டியின் மேலே",
          "postBlankText": "வைக்கவும்.",
          "audioUrl": "/path/to/audio/sentence2.mp3",
          "correctWordId": "word_cup"
        },
        {
          "id": "sent3",
          "preBlankText": "செந்தாழைப்பழத்தைச் சமையலறைக்கு உள்ளே",
          "postBlankText": "வைக்கவும்.",
          "audioUrl": "/path/to/audio/sentence3.mp3",
          "correctWordId": "word_banana"
        },
        {
          "id": "sent4",
          "preBlankText": "கரண்டியைச் சமையலறைக்கு வெளியில்",
          "postBlankText": "வைக்கவும்.",
          "audioUrl": "/path/to/audio/sentence4.mp3",
          "correctWordId": "word_spoon"
        },
        {
          "id": "sent5",
          "preBlankText": "மேசைக்கு அருகில்",
          "postBlankText": "நிற்கிறான்.",
          "audioUrl": "/path/to/audio/sentence5.mp3",
          "correctWordId": "word_boy"
        },
        {
          "id": "sent6",
          "preBlankText": "மேசைக்கு தொலைவில்",
          "postBlankText": "இருக்கிறார்.",
          "audioUrl": "/path/to/audio/sentence6.mp3",
          "correctWordId": "word_father"
        }
      ],
      "words": [
        { "id": "word_coffee", "text": "காபி" },
        { "id": "word_cup", "text": "குவளை" },
        { "id": "word_banana", "text": "செந்தாழைப்பழம்" },
        { "id": "word_spoon", "text": "கரண்டி" },
        { "id": "word_boy", "text": "சிறுவன்" },
        { "id": "word_father", "text": "தாத்தா" }
      ]
    },
    46: {

      "title": "பொருட்களை சரியான அறையில் வைக்கவும்",
      "instruction": "ஒவ்வொரு பொருளையும் இழுத்து, அது எந்த அறைக்குச் சொந்தமானதோ அந்த அறையில் விடவும்.",
      "items": [
        { "id": 1, "name": "அடுப்பு", "imageUrl": "/images/stove.png", "audioUrl": "/audio/stove.mp3", "categoryId": "cat1" },
        { "id": 2, "name": "சோபா", "imageUrl": "/images/sofa.png", "audioUrl": "/audio/sofa.mp3", "categoryId": "cat2" },
        { "id": 3, "name": "கட்டில்", "imageUrl": "/images/bed.png", "audioUrl": "/audio/bed.mp3", "categoryId": "cat3" },
        { "id": 4, "name": "குவளை", "imageUrl": "/images/cup.png", "audioUrl": "/audio/cup.mp3", "categoryId": "cat1" }
      ],
      "categories": [
        { "id": "cat1", "name": "சமையலறை" },
        { "id": "cat2", "name": "வரவேற்பறை" },
        { "id": "cat3", "name": "படுக்கையறை" }
      ]
    }
  }
  // Fetch the template for the given activity type, or a default message if not found

  const template = templates[activityTypeId] || { note: "No template defined for this activity type yet." };

  // Return as a nicely formatted string
  return JSON.stringify(template, null, 2);
};