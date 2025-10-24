using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.Configurations
{
    public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
    {
        public void Configure(EntityTypeBuilder<Lesson> builder)
        {
            // --- Schema Configuration ---
            builder.HasKey(l => l.LessonId);
            builder.Property(l => l.LessonName).IsRequired().HasMaxLength(200);
            builder.Property(l => l.Slug).IsRequired().HasMaxLength(100);
            builder.HasIndex(l => new { l.LevelId, l.SequenceOrder }).IsUnique();
            builder.HasIndex(l => l.Slug).IsUnique();

            // --- Data Seeding ---
            builder.HasData(

                // == Preschool (மழலையர் நிலை) - LevelId 1 ==
                new Lesson { LessonId = 1,  LevelId = 1, SequenceOrder = 1,  LessonName = "பாடம் 01: உடல் உறுப்புகள்", Slug = "malalaiyar-udal-uruppukal", Description = "Basic body parts" },
                new Lesson { LessonId = 2,  LevelId = 1, SequenceOrder = 2,  LessonName = "பாடம் 02: எனது குடும்பம்", Slug = "malalaiyar-enathu-kudumbam", Description = "Immediate family members" },
                new Lesson { LessonId = 3,  LevelId = 1, SequenceOrder = 3,  LessonName = "பாடம் 03: எனது வீடு", Slug = "malalaiyar-enathu-veedu", Description = "Parts of a house" },
                new Lesson { LessonId = 4,  LevelId = 1, SequenceOrder = 4,  LessonName = "பாடம் 04: உணவுகள்", Slug = "malalaiyar-unavugal", Description = "Common foods and tastes" },
                new Lesson { LessonId = 5,  LevelId = 1, SequenceOrder = 5,  LessonName = "பாடம் 05: வண்ணங்கள்", Slug = "malalaiyar-vannangal", Description = "Colors" },
                new Lesson { LessonId = 6,  LevelId = 1, SequenceOrder = 6,  LessonName = "பாடம் 06: பூக்கள்", Slug = "malalaiyar-pookkal", Description = "Flowers" },
                new Lesson { LessonId = 7,  LevelId = 1, SequenceOrder = 7,  LessonName = "பாடம் 07: பறவைகள்", Slug = "malalaiyar-paravaigal", Description = "Birds" },
                new Lesson { LessonId = 8,  LevelId = 1, SequenceOrder = 8,  LessonName = "பாடம் 08: விலங்குகள்", Slug = "malalaiyar-vilangugal", Description = "Animals" },
                new Lesson { LessonId = 9,  LevelId = 1, SequenceOrder = 9,  LessonName = "பாடம் 09: விளையாட்டுகள்", Slug = "malalaiyar-vilaiyattukal", Description = "Games and play" },
                new Lesson { LessonId = 10, LevelId = 1, SequenceOrder = 10, LessonName = "பாடம் 10: கொண்டாட்டம்", Slug = "malalaiyar-kondaattam", Description = "Celebrations" },
                
                // == Kindergarten (சிறுவர் நிலை) - LevelId 2 ==
                new Lesson { LessonId = 11, LevelId = 2, SequenceOrder = 1, LessonName = "பாடம் 01: நான்", Slug = "siruvar-naan", Description = "Myself and body parts" },
                new Lesson { LessonId = 12, LevelId = 2, SequenceOrder = 2, LessonName = "பாடம் 02: என் குடும்பம்", Slug = "siruvar-en-kudumbam", Description = "Extended family" },
                new Lesson { LessonId = 13, LevelId = 2, SequenceOrder = 3, LessonName = "பாடம் 03: எனது வீடு", Slug = "siruvar-enathu-veedu", Description = "Rooms in a house" },
                new Lesson { LessonId = 14, LevelId = 2, SequenceOrder = 4, LessonName = "பாடம் 04: உணவுகள்", Slug = "siruvar-unavugal", Description = "Food types including seafood" },
                new Lesson { LessonId = 15, LevelId = 2, SequenceOrder = 5, LessonName = "பாடம் 05: உடைகள்", Slug = "siruvar-udaigal", Description = "Clothing" },
                new Lesson { LessonId = 16, LevelId = 2, SequenceOrder = 6, LessonName = "பாடம் 06: விலங்குகள்", Slug = "siruvar-vilangugal", Description = "Wild animals" },
                new Lesson { LessonId = 17, LevelId = 2, SequenceOrder = 7, LessonName = "பாடம் 07: பிறந்தநாள்", Slug = "siruvar-piranthanaal", Description = "Birthday celebrations" },
                new Lesson { LessonId = 18, LevelId = 2, SequenceOrder = 8, LessonName = "பாடம் 08: வகுப்பறை", Slug = "siruvar-vagupparai", Description = "Classroom items" },
                new Lesson { LessonId = 19, LevelId = 2, SequenceOrder = 9, LessonName = "பாடம் 09: உந்துகள்", Slug = "siruvar-unthugal", Description = "Vehicles" },
                new Lesson { LessonId = 20, LevelId = 2, SequenceOrder = 10, LessonName = "பாடம் 10: விளையாட்டு", Slug = "siruvar-vilaiyattu", Description = "Verbs for play" },

                // == Grade 1 (ஆண்டு 01) - LevelId 3 ==
                new Lesson { LessonId = 21, LevelId = 3, SequenceOrder = 1, LessonName = "பாடம் 01: தமிழ்ப்பள்ளி", Slug = "aandu-01-paadam-01", Description = "The Tamil school" },
                new Lesson { LessonId = 22, LevelId = 3, SequenceOrder = 2, LessonName = "பாடம் 02: விடுமுறை", Slug = "aandu-01-paadam-02", Description = "Vacation" },
                new Lesson { LessonId = 23, LevelId = 3, SequenceOrder = 3, LessonName = "பாடம் 03: நண்பர்கள்", Slug = "aandu-01-paadam-03", Description = "Friends" },
                new Lesson { LessonId = 24, LevelId = 3, SequenceOrder = 4, LessonName = "பாடம் 04: அன்னையர் நாள்", Slug = "aandu-01-paadam-04", Description = "Mother's Day" },
                new Lesson { LessonId = 25, LevelId = 3, SequenceOrder = 5, LessonName = "பாடம் 05: தைப்பொங்கல்", Slug = "aandu-01-paadam-05", Description = "Thai Pongal festival" },
                new Lesson { LessonId = 26, LevelId = 3, SequenceOrder = 6, LessonName = "பாடம் 06: அங்காடி", Slug = "aandu-01-paadam-06", Description = "The Market" },
                new Lesson { LessonId = 27, LevelId = 3, SequenceOrder = 7, LessonName = "பாடம் 07: வீட்டு விலங்குகள்", Slug = "aandu-01-paadam-07", Description = "Domestic Animals" },
                new Lesson { LessonId = 28, LevelId = 3, SequenceOrder = 8, LessonName = "பாடம் 08: பனி காலம்", Slug = "aandu-01-paadam-08", Description = "Winter Season" },
                new Lesson { LessonId = 29, LevelId = 3, SequenceOrder = 9, LessonName = "பாடம் 09: நிறையுணவு", Slug = "aandu-01-paadam-09", Description = "Balanced Diet" },
                new Lesson { LessonId = 30, LevelId = 3, SequenceOrder = 10, LessonName = "பாடம் 10: நாள்கள், மாதங்கள்", Slug = "aandu-01-paadam-10", Description = "Days and Months" },

                // == Grade 2 (ஆண்டு 02) - LevelId 4 ==
                new Lesson { LessonId = 31, LevelId = 4, SequenceOrder = 1, LessonName = "பாடம் 01: தமிழ்மொழி", Slug = "aandu-02-paadam-01", Description = "The Tamil Language" },
                new Lesson { LessonId = 32, LevelId = 4, SequenceOrder = 2, LessonName = "பாடம் 02: எங்கள் தாயகம்", Slug = "aandu-02-paadam-02", Description = "Our Motherland" },
                new Lesson { LessonId = 33, LevelId = 4, SequenceOrder = 3, LessonName = "பாடம் 03: இன்கலைகள்", Slug = "aandu-02-paadam-03", Description = "Fine Arts" },
                new Lesson { LessonId = 34, LevelId = 4, SequenceOrder = 4, LessonName = "பாடம் 04: கை கொடுப்போம்", Slug = "aandu-02-paadam-04", Description = "Community Helpers" },
                new Lesson { LessonId = 35, LevelId = 4, SequenceOrder = 5, LessonName = "பாடம் 05: சங்கிலியன்", Slug = "aandu-02-paadam-05", Description = "King Cankiliyan" },
                new Lesson { LessonId = 36, LevelId = 4, SequenceOrder = 6, LessonName = "பாடம் 06: பருவகாலங்கள்", Slug = "aandu-02-paadam-06", Description = "Seasons" },
                new Lesson { LessonId = 37, LevelId = 4, SequenceOrder = 7, LessonName = "பாடம் 07: நாம் வாழும் சூழல்", Slug = "aandu-02-paadam-07", Description = "Our Environment" },
                new Lesson { LessonId = 38, LevelId = 4, SequenceOrder = 8, LessonName = "பாடம் 08: சோமசுந்தரப் புலவர்", Slug = "aandu-02-paadam-08", Description = "Poet Somasundara Pulavar" },
                new Lesson { LessonId = 39, LevelId = 4, SequenceOrder = 9, LessonName = "பாடம் 09: பனைமரம்", Slug = "aandu-02-paadam-09", Description = "Palmyra Tree" },
                new Lesson { LessonId = 40, LevelId = 4, SequenceOrder = 10, LessonName = "பாடம் 10: ஔவையார்", Slug = "aandu-02-paadam-10", Description = "Poet Avvaiyar" },
                new Lesson { LessonId = 41, LevelId = 4, SequenceOrder = 11, LessonName = "பாடம் 11: மூத்தோரை மதிப்போம்", Slug = "aandu-02-paadam-11", Description = "Respecting Elders" },
                new Lesson { LessonId = 42, LevelId = 4, SequenceOrder = 12, LessonName = "பாடம் 12: விண்வெளி", Slug = "aandu-02-paadam-12", Description = "Outer Space" },

                // == Grade 3 (ஆண்டு 03) - LevelId 5 ==
                new Lesson { LessonId = 43, LevelId = 5, SequenceOrder = 1, LessonName = "பாடம் 01: எமது மொழி", Slug = "aandu-03-paadam-01", Description = "Our Language" },
                new Lesson { LessonId = 44, LevelId = 5, SequenceOrder = 2, LessonName = "பாடம் 02: முக்கனிகள்", Slug = "aandu-03-paadam-02", Description = "The Three Great Fruits" },
                new Lesson { LessonId = 45, LevelId = 5, SequenceOrder = 3, LessonName = "பாடம் 03: கொடை", Slug = "aandu-03-paadam-03", Description = "Charity" },
                new Lesson { LessonId = 46, LevelId = 5, SequenceOrder = 4, LessonName = "பாடம் 04: ஒற்றுமை", Slug = "aandu-03-paadam-04", Description = "Unity" },
                new Lesson { LessonId = 47, LevelId = 5, SequenceOrder = 5, LessonName = "பாடம் 05: மட்டக்களப்பு", Slug = "aandu-03-paadam-05", Description = "Batticaloa" },
                new Lesson { LessonId = 48, LevelId = 5, SequenceOrder = 6, LessonName = "பாடம் 06: பண்டாரவன்னியன்", Slug = "aandu-03-paadam-06", Description = "Pandara Vanniyan" },
                new Lesson { LessonId = 49, LevelId = 5, SequenceOrder = 7, LessonName = "பாடம் 07: நாட்டார் பாடல்கள்", Slug = "aandu-03-paadam-07", Description = "Folk Songs" },
                new Lesson { LessonId = 50, LevelId = 5, SequenceOrder = 8, LessonName = "பாடம் 08: திருவள்ளுவர்", Slug = "aandu-03-paadam-08", Description = "Thiruvalluvar" },
                new Lesson { LessonId = 51, LevelId = 5, SequenceOrder = 9, LessonName = "பாடம் 09: எங்கள் பட்டம்", Slug = "aandu-03-paadam-09", Description = "Our Kite" },
                new Lesson { LessonId = 52, LevelId = 5, SequenceOrder = 10, LessonName = "பாடம் 10: கல்லணை", Slug = "aandu-03-paadam-10", Description = "Kallanai Dam" },
                new Lesson { LessonId = 53, LevelId = 5, SequenceOrder = 11, LessonName = "பாடம் 11: தண்ணீர்", Slug = "aandu-03-paadam-11", Description = "Water" },
                new Lesson { LessonId = 54, LevelId = 5, SequenceOrder = 12, LessonName = "பாடம் 12: கிளித்தட்டு", Slug = "aandu-03-paadam-12", Description = "Kilithattu Game" },

                // == Grade 4 (ஆண்டு 04) - LevelId 6 ==
                new Lesson { LessonId = 55, LevelId = 6, SequenceOrder = 1, LessonName = "பாடம் 01: தமிழ்மொழி", Slug = "aandu-04-paadam-01", Description = "Tamil Language Deep Dive" },
                new Lesson { LessonId = 56, LevelId = 6, SequenceOrder = 2, LessonName = "பாடம் 02: மொழிப்பயிற்சி", Slug = "aandu-04-paadam-02", Description = "Language Exercises" },
                new Lesson { LessonId = 57, LevelId = 6, SequenceOrder = 3, LessonName = "பாடம் 03: கல்வியின் சிறப்பு", Slug = "aandu-04-paadam-03", Description = "The Greatness of Education" },
                new Lesson { LessonId = 58, LevelId = 6, SequenceOrder = 4, LessonName = "பாடம் 04: பால்", Slug = "aandu-04-paadam-04", Description = "Grammatical Gender" },
                new Lesson { LessonId = 59, LevelId = 6, SequenceOrder = 5, LessonName = "பாடம் 05: தொடர்பாடல்", Slug = "aandu-04-paadam-05", Description = "Communication" },
                new Lesson { LessonId = 60, LevelId = 6, SequenceOrder = 6, LessonName = "பாடம் 06: ஆடிப்பிறப்பு", Slug = "aandu-04-paadam-06", Description = "Aadi Pirappu festival" },
                new Lesson { LessonId = 61, LevelId = 6, SequenceOrder = 7, LessonName = "பாடம் 07: நூலகம்", Slug = "aandu-04-paadam-07", Description = "The Library" },
                new Lesson { LessonId = 62, LevelId = 6, SequenceOrder = 8, LessonName = "பாடம் 08: இசைக்கருவிகள்", Slug = "aandu-04-paadam-08", Description = "Musical Instruments" },
                new Lesson { LessonId = 63, LevelId = 6, SequenceOrder = 9, LessonName = "பாடம் 09: திருகோணமலை", Slug = "aandu-04-paadam-09", Description = "Trincomalee" },
                new Lesson { LessonId = 64, LevelId = 6, SequenceOrder = 10, LessonName = "பாடம் 10: குளிர்காலம்", Slug = "aandu-04-paadam-10", Description = "Winter" },
                new Lesson { LessonId = 65, LevelId = 6, SequenceOrder = 11, LessonName = "பாடம் 11: உண்மையின் உயர்வு", Slug = "aandu-04-paadam-11", Description = "The Power of Truth" },
                new Lesson { LessonId = 66, LevelId = 6, SequenceOrder = 12, LessonName = "பாடம் 12: நடுகல்", Slug = "aandu-04-paadam-12", Description = "Hero Stones" },
                
                // == Grade 5 (ஆண்டு 05) - LevelId 7 ==
                new Lesson { LessonId = 67, LevelId = 7, SequenceOrder = 1, LessonName = "பாடம் 01: தமிழர் கலைகள்", Slug = "aandu-05-paadam-01", Description = "Tamil Arts" },
                new Lesson { LessonId = 68, LevelId = 7, SequenceOrder = 2, LessonName = "பாடம் 02: ஒழுக்கம்", Slug = "aandu-05-paadam-02", Description = "Discipline" },
                new Lesson { LessonId = 69, LevelId = 7, SequenceOrder = 3, LessonName = "பாடம் 03: நட்பு", Slug = "aandu-05-paadam-03", Description = "Friendship" },
                new Lesson { LessonId = 70, LevelId = 7, SequenceOrder = 4, LessonName = "பாடம் 04: பாரதியார்", Slug = "aandu-05-paadam-04", Description = "Poet Bharathiyar" },
                new Lesson { LessonId = 71, LevelId = 7, SequenceOrder = 5, LessonName = "பாடம் 05: இளங்கோ அடிகள்", Slug = "aandu-05-paadam-05", Description = "Ilango Adigal" },
                new Lesson { LessonId = 72, LevelId = 7, SequenceOrder = 6, LessonName = "பாடம் 06: செய்தித்தாள்", Slug = "aandu-05-paadam-06", Description = "Newspaper" },
                new Lesson { LessonId = 73, LevelId = 7, SequenceOrder = 7, LessonName = "பாடம் 07: தைத்திருநாள்", Slug = "aandu-05-paadam-07", Description = "Thai Thirunaal" },
                new Lesson { LessonId = 74, LevelId = 7, SequenceOrder = 8, LessonName = "பாடம் 08: பவளக்கொடி", Slug = "aandu-05-paadam-08", Description = "Pavalakodi" },
                new Lesson { LessonId = 75, LevelId = 7, SequenceOrder = 9, LessonName = "பாடம் 09: மன்னார்", Slug = "aandu-05-paadam-09", Description = "Mannar" },
                new Lesson { LessonId = 76, LevelId = 7, SequenceOrder = 10, LessonName = "பாடம் 10: நோயற்ற வாழ்வு", Slug = "aandu-05-paadam-10", Description = "A Healthy Life" },
                new Lesson { LessonId = 77, LevelId = 7, SequenceOrder = 11, LessonName = "பாடம் 11: மாவீரம்", Slug = "aandu-05-paadam-11", Description = "Heroism" },
                new Lesson { LessonId = 78, LevelId = 7, SequenceOrder = 12, LessonName = "பாடம் 12: ஒலிம்பிக்", Slug = "aandu-05-paadam-12", Description = "The Olympics" }
            );
        }
    }
}