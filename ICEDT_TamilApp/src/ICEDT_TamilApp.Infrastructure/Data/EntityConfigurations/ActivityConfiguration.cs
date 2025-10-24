using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.EntityConfigurations
{
    public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
    {
        public void Configure(EntityTypeBuilder<Activity> builder)
        {
            builder.HasKey(a => a.ActivityId);
            builder.Property(a => a.LessonId).IsRequired();
            builder.Property(a => a.ActivityTypeId).IsRequired();
            builder.Property(a => a.Title).IsRequired().HasMaxLength(100);
            builder.Property(a => a.SequenceOrder).IsRequired();
            builder.Property(a => a.ContentJson).IsRequired();

            builder
                .HasOne(a => a.Lesson)
                .WithMany(l => l.Activities)
                .HasForeignKey(a => a.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(a => a.ActivityType)
                .WithMany(t => t.Activities)
                .HasForeignKey(a => a.ActivityTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(a => a.MainActivity)
                .WithMany(m => m.Activities)
                .HasForeignKey(a => a.MainActivityId)
                .IsRequired();

            builder.HasIndex(a => new { a.LessonId, a.SequenceOrder }).IsUnique();

            builder.HasData(
                // =========================================================================
                // == Level 1 (மழலையர் நிலை) - Preschool Lessons
                // =========================================================================

                // --- பாடம் 01: உடல் உறுப்புகள் (Body Parts) ---
                new Activity
                {
                    ActivityId = 1,
                    LessonId = 1,
                    Title = "உடல் உறுப்புகள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""கண்"", ""imageUrl"": ""malaiyar/lesson1/kan.jpg"", ""audioUrl"": ""malaiyar/lesson1/kan.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""காது"", ""imageUrl"": ""malaiyar/lesson1/kaathu.jpg"", ""audioUrl"": ""malaiyar/lesson1/kaathu.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""முகம்"", ""imageUrl"": ""malaiyar/lesson1/mugam.jpg"", ""audioUrl"": ""malaiyar/lesson1/mugam.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""வாய்"", ""imageUrl"": ""malaiyar/lesson1/vaai.jpg"", ""audioUrl"": ""malaiyar/lesson1/vaai.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""மூக்கு"", ""imageUrl"": ""malaiyar/lesson1/mooku.jpg"", ""audioUrl"": ""malaiyar/lesson1/mooku.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""கை"", ""imageUrl"": ""malaiyar/lesson1/kai.jpg"", ""audioUrl"": ""malaiyar/lesson1/kai.mp3"" },
              { ""title"": ""உடல் உறுப்புகள் (நான்)"", ""word"": ""கால்"", ""imageUrl"": ""malaiyar/lesson1/kaal.jpg"", ""audioUrl"": ""malaiyar/lesson1/kaal.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 2,
                    LessonId = 1,
                    Title = "உயிர் எழுத்து: 'அ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'அ' வில் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""அ"",
                ""items"": [
                  { ""text"": ""அம்மா"", ""imageUrl"": ""malaiyar/lesson1/amma.jpg"", ""audioUrl"": ""malaiyar/lesson1/amma.mp3"" },
                  { ""text"": ""அரிசி"", ""imageUrl"": ""malaiyar/lesson1/arisi.jpg"", ""audioUrl"": ""malaiyar/lesson1/arisi.mp3"" },
                  { ""text"": ""அன்னம்"", ""imageUrl"": ""malaiyar/lesson1/annam.jpg"", ""audioUrl"": ""malaiyar/lesson1/annam.mp3"" },
                  { ""text"": ""அடுப்பு"", ""imageUrl"": ""malaiyar/lesson1/aduppu.jpg"", ""audioUrl"": ""malaiyar/lesson1/aduppu.mp3"" },
                  { ""text"": ""அருவி"", ""imageUrl"": ""malaiyar/lesson1/aruvi.jpg"", ""audioUrl"": ""malaiyar/lesson1/aruvi.mp3"" }
                ]
            }",
                },
                // --- பாடம் 02: எனது குடும்பம் (My Family) ---
                new Activity
                {
                    ActivityId = 3,
                    LessonId = 2,
                    Title = "எனது குடும்பம்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""எனது குடும்பம்"", ""word"": ""அம்மா"", ""imageUrl"": ""malaiyar/lesson2/amma.jpg"", ""audioUrl"": ""malaiyar/lesson2/amma.mp3"" },
              { ""title"": ""எனது குடும்பம்"", ""word"": ""அப்பா"", ""imageUrl"": ""malaiyar/lesson2/appa.jpg"", ""audioUrl"": ""malaiyar/lesson2/appa.mp3"" },
              { ""title"": ""எனது குடும்பம்"", ""word"": ""அக்கா"", ""imageUrl"": ""malaiyar/lesson2/akka.jpg"", ""audioUrl"": ""malaiyar/lesson2/akka.mp3"" },
              { ""title"": ""எனது குடும்பம்"", ""word"": ""அண்ணா"", ""imageUrl"": ""malaiyar/lesson2/anna.jpg"", ""audioUrl"": ""malaiyar/lesson2/anna.mp3"" },
              { ""title"": ""எனது குடும்பம்"", ""word"": ""தம்பி"", ""imageUrl"": ""malaiyar/lesson2/thambi.jpg"", ""audioUrl"": ""malaiyar/lesson2/thambi.mp3"" },
              { ""title"": ""எனது குடும்பம்"", ""word"": ""தங்கை"", ""imageUrl"": ""malaiyar/lesson2/thangai.jpg"", ""audioUrl"": ""malaiyar/lesson2/thangai.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 4,
                    LessonId = 2,
                    Title = "உயிர் எழுத்து: 'ஆ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'ஆ' வில் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஆ"",
                ""items"": [
                  { ""text"": ""ஆடு"", ""imageUrl"": ""malaiyar/lesson2/aadu.jpg"", ""audioUrl"": ""malaiyar/lesson2/aadu.mp3"" },
                  { ""text"": ""ஆமை"", ""imageUrl"": ""malaiyar/lesson2/aamai.jpg"", ""audioUrl"": ""malaiyar/lesson2/aamai.mp3"" },
                  { ""text"": ""ஆந்தை"", ""imageUrl"": ""malaiyar/lesson2/aanthai.jpg"", ""audioUrl"": ""malaiyar/lesson2/aanthai.mp3"" },
                  { ""text"": ""ஆலமரம்"", ""imageUrl"": ""malaiyar/lesson2/aalamaram.jpg"", ""audioUrl"": ""malaiyar/lesson2/aalamaram.mp3"" },
                  { ""text"": ""ஆறு"", ""imageUrl"": ""malaiyar/lesson2/aaru.jpg"", ""audioUrl"": ""malaiyar/lesson2/aaru.mp3"" }
                ]
            }",
                },
                // --- பாடம் 03: எனது வீடு (My House) ---
                new Activity
                {
                    ActivityId = 5,
                    LessonId = 3,
                    Title = "எனது வீடு: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""எனது வீடு"", ""word"": ""கூரை"", ""imageUrl"": ""malaiyar/lesson3/koorai.jpg"", ""audioUrl"": ""malaiyar/lesson3/koorai.mp3"" },
              { ""title"": ""எனது வீடு"", ""word"": ""சாளரம்"", ""imageUrl"": ""malaiyar/lesson3/saalaram.jpg"", ""audioUrl"": ""malaiyar/lesson3/saalaram.mp3"" },
              { ""title"": ""எனது வீடு"", ""word"": ""கதவு"", ""imageUrl"": ""malaiyar/lesson3/kathavu.jpg"", ""audioUrl"": ""malaiyar/lesson3/kathavu.mp3"" },
              { ""title"": ""எனது வீடு"", ""word"": ""சுவர்"", ""imageUrl"": ""malaiyar/lesson3/suvar.jpg"", ""audioUrl"": ""malaiyar/lesson3/suvar.mp3"" },
              { ""title"": ""எனது வீடு"", ""word"": ""சமையலறை"", ""imageUrl"": ""malaiyar/lesson3/samayalarai.jpg"", ""audioUrl"": ""malaiyar/lesson3/samayalarai.mp3"" },
              { ""title"": ""எனது வீடு"", ""word"": ""படுக்கையறை"", ""imageUrl"": ""malaiyar/lesson3/padukkaiyarai.jpg"", ""audioUrl"": ""malaiyar/lesson3/padukkaiyarai.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 6,
                    LessonId = 3,
                    Title = "உயிர் எழுத்து: 'இ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'இ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""இ"",
                ""items"": [
                  { ""text"": ""இலை"", ""imageUrl"": ""malaiyar/lesson3/ilai.jpg"", ""audioUrl"": ""malaiyar/lesson3/ilai.mp3"" },
                  { ""text"": ""இறகு"", ""imageUrl"": ""malaiyar/lesson3/iragu.jpg"", ""audioUrl"": ""malaiyar/lesson3/iragu.mp3"" },
                  { ""text"": ""இரவு"", ""imageUrl"": ""malaiyar/lesson3/iravu.jpg"", ""audioUrl"": ""malaiyar/lesson3/iravu.mp3"" },
                  { ""text"": ""இனிப்பு"", ""imageUrl"": ""malaiyar/lesson3/inippu.jpg"", ""audioUrl"": ""malaiyar/lesson3/inippu.mp3"" },
                  { ""text"": ""இரும்பு"", ""imageUrl"": ""malaiyar/lesson3/irumbu.jpg"", ""audioUrl"": ""malaiyar/lesson3/irumbu.mp3"" }
                ]
            }",
                },
                // --- பாடம் 04: உணவுகள் (Foods) ---
                new Activity
                {
                    ActivityId = 7,
                    LessonId = 4,
                    Title = "உணவுகள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""உணவுகள்"", ""word"": ""சோறு"", ""imageUrl"": ""malaiyar/lesson4/soru.jpg"", ""audioUrl"": ""malaiyar/lesson4/soru.mp3"" },
              { ""title"": ""உணவுகள்"", ""word"": ""பிட்டு"", ""imageUrl"": ""malaiyar/lesson4/pittu.jpg"", ""audioUrl"": ""malaiyar/lesson4/pittu.mp3"" },
              { ""title"": ""உணவுகள்"", ""word"": ""இட்டலி"", ""imageUrl"": ""malaiyar/lesson4/iddali.jpg"", ""audioUrl"": ""malaiyar/lesson4/iddali.mp3"" },
              { ""title"": ""உணவுகள்"", ""word"": ""தோசை"", ""imageUrl"": ""malaiyar/lesson4/thosai.jpg"", ""audioUrl"": ""malaiyar/lesson4/thosai.mp3"" },
              { ""title"": ""உணவுகள்"", ""word"": ""இடியப்பம்"", ""imageUrl"": ""malaiyar/lesson4/idiyappam.jpg"", ""audioUrl"": ""malaiyar/lesson4/idiyappam.mp3"" },
              { ""title"": ""உணவுகள்"", ""word"": ""கறி"", ""imageUrl"": ""malaiyar/lesson4/curry.jpg"", ""audioUrl"": ""malaiyar/lesson4/curry.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 8,
                    LessonId = 4,
                    Title = "உயிர் எழுத்து: 'ஈ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'ஈ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஈ"",
                ""items"": [
                  { ""text"": ""ஈழம்"", ""imageUrl"": ""malaiyar/lesson4/eelam.jpg"", ""audioUrl"": ""malaiyar/lesson4/eelam.mp3"" },
                  { ""text"": ""ஈட்டி"", ""imageUrl"": ""malaiyar/lesson4/eetti.jpg"", ""audioUrl"": ""malaiyar/lesson4/eetti.mp3"" },
                  { ""text"": ""ஈ"", ""imageUrl"": ""malaiyar/lesson4/ee.jpg"", ""audioUrl"": ""malaiyar/lesson4/ee.mp3"" },
                  { ""text"": ""ஈச்சமரம்"", ""imageUrl"": ""malaiyar/lesson4/eechamaram.jpg"", ""audioUrl"": ""malaiyar/lesson4/eechamaram.mp3"" },
                  { ""text"": ""ஈசல்"", ""imageUrl"": ""malaiyar/lesson4/eesal.jpg"", ""audioUrl"": ""malaiyar/lesson4/eesal.mp3"" }
                ]
            }",
                },
                // --- பாடம் 05: வண்ணங்கள் (Colors) ---
                new Activity
                {
                    ActivityId = 9,
                    LessonId = 5,
                    Title = "வண்ணங்கள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""வண்ணங்கள்"", ""word"": ""கறுப்பு"", ""imageUrl"": ""malaiyar/lesson5/karuppu.jpg"", ""audioUrl"": ""malaiyar/lesson5/karuppu.mp3"" },
              { ""title"": ""வண்ணங்கள்"", ""word"": ""சிவப்பு"", ""imageUrl"": ""malaiyar/lesson5/sivappu.jpg"", ""audioUrl"": ""malaiyar/lesson5/sivappu.mp3"" },
              { ""title"": ""வண்ணங்கள்"", ""word"": ""மஞ்சள்"", ""imageUrl"": ""malaiyar/lesson5/manjal.jpg"", ""audioUrl"": ""malaiyar/lesson5/manjal.mp3"" },
              { ""title"": ""வண்ணங்கள்"", ""word"": ""வெள்ளை"", ""imageUrl"": ""malaiyar/lesson5/vellai.jpg"", ""audioUrl"": ""malaiyar/lesson5/vellai.mp3"" },
              { ""title"": ""வண்ணங்கள்"", ""word"": ""நீலம்"", ""imageUrl"": ""malaiyar/lesson5/neelam.jpg"", ""audioUrl"": ""malaiyar/lesson5/neelam.mp3"" },
              { ""title"": ""வண்ணங்கள்"", ""word"": ""பச்சை"", ""imageUrl"": ""malaiyar/lesson5/pachai.jpg"", ""audioUrl"": ""malaiyar/lesson5/pachai.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 10,
                    LessonId = 5,
                    Title = "உயிர் எழுத்து: 'உ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'உ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""உ"",
                ""items"": [
                  { ""text"": ""உப்பு"", ""imageUrl"": ""malaiyar/lesson5/uppu.jpg"", ""audioUrl"": ""malaiyar/lesson5/uppu.mp3"" },
                  { ""text"": ""உள்ளி"", ""imageUrl"": ""malaiyar/lesson5/ulli.jpg"", ""audioUrl"": ""malaiyar/lesson5/ulli.mp3"" },
                  { ""text"": ""உடை"", ""imageUrl"": ""malaiyar/lesson5/udai.jpg"", ""audioUrl"": ""malaiyar/lesson5/udai.mp3"" },
                  { ""text"": ""உலகம்"", ""imageUrl"": ""malaiyar/lesson5/ulagam.jpg"", ""audioUrl"": ""malaiyar/lesson5/ulagam.mp3"" },
                  { ""text"": ""உழுந்து"", ""imageUrl"": ""malaiyar/lesson5/ulunthu.jpg"", ""audioUrl"": ""malaiyar/lesson5/ulunthu.mp3"" }
                ]
            }",
                },
                // --- பாடம் 06: பூக்கள் (Flowers) ---
                new Activity
                {
                    ActivityId = 11,
                    LessonId = 6,
                    Title = "பூக்கள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""பூக்கள்"", ""word"": ""கார்த்திகைப்பூ"", ""imageUrl"": ""malaiyar/lesson6/karthigaipoo.jpg"", ""audioUrl"": ""malaiyar/lesson6/karthigaipoo.mp3"" },
              { ""title"": ""பூக்கள்"", ""word"": ""சூரியகாந்திப்பூ"", ""imageUrl"": ""malaiyar/lesson6/suriyagandhipoo.jpg"", ""audioUrl"": ""malaiyar/lesson6/suriyagandhipoo.mp3"" },
              { ""title"": ""பூக்கள்"", ""word"": ""செவ்வரத்தம்பூ"", ""imageUrl"": ""malaiyar/lesson6/sembaruthi.jpg"", ""audioUrl"": ""malaiyar/lesson6/sembaruthi.mp3"" },
              { ""title"": ""பூக்கள்"", ""word"": ""தாமரைப்பூ"", ""imageUrl"": ""malaiyar/lesson6/thamarai.jpg"", ""audioUrl"": ""malaiyar/lesson6/thamarai.mp3"" },
              { ""title"": ""பூக்கள்"", ""word"": ""மல்லிகைப்பூ"", ""imageUrl"": ""malaiyar/lesson6/malligai.jpg"", ""audioUrl"": ""malaiyar/lesson6/malligai.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 12,
                    LessonId = 6,
                    Title = "உயிர் எழுத்து: 'ஊ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'ஊ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஊ"",
                ""items"": [
                  { ""text"": ""ஊஞ்சல்"", ""imageUrl"": ""malaiyar/lesson6/oonjal.jpg"", ""audioUrl"": ""malaiyar/lesson6/oonjal.mp3"" },
                  { ""text"": ""ஊர்"", ""imageUrl"": ""malaiyar/lesson6/oor.jpg"", ""audioUrl"": ""malaiyar/lesson6/oor.mp3"" },
                  { ""text"": ""ஊறுகாய்"", ""imageUrl"": ""malaiyar/lesson6/oorugai.jpg"", ""audioUrl"": ""malaiyar/lesson6/oorugai.mp3"" },
                  { ""text"": ""ஊசி"", ""imageUrl"": ""malaiyar/lesson6/oosi.jpg"", ""audioUrl"": ""malaiyar/lesson6/oosi.mp3"" },
                  { ""text"": ""ஊதல்"", ""imageUrl"": ""malaiyar/lesson6/oothal.jpg"", ""audioUrl"": ""malaiyar/lesson6/oothal.mp3"" }
                ]
            }",
                },
                // --- பாடம் 07: பறவைகள் (Birds) ---
                new Activity
                {
                    ActivityId = 13,
                    LessonId = 7,
                    Title = "பறவைகள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""பறவைகள்"", ""word"": ""காகம்"", ""imageUrl"": ""malaiyar/lesson7/kagam.jpg"", ""audioUrl"": ""malaiyar/lesson7/kagam.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""கிளி"", ""imageUrl"": ""malaiyar/lesson7/kili.jpg"", ""audioUrl"": ""malaiyar/lesson7/kili.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""குயில்"", ""imageUrl"": ""malaiyar/lesson7/kuyil.jpg"", ""audioUrl"": ""malaiyar/lesson7/kuyil.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""வாத்து"", ""imageUrl"": ""malaiyar/lesson7/vaathu.jpg"", ""audioUrl"": ""malaiyar/lesson7/vaathu.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""கோழி"", ""imageUrl"": ""malaiyar/lesson7/kozhi.jpg"", ""audioUrl"": ""malaiyar/lesson7/kozhi.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""புறா"", ""imageUrl"": ""malaiyar/lesson7/pura.jpg"", ""audioUrl"": ""malaiyar/lesson7/pura.mp3"" },
              { ""title"": ""பறவைகள்"", ""word"": ""மயில்"", ""imageUrl"": ""malaiyar/lesson7/mayil.jpg"", ""audioUrl"": ""malaiyar/lesson7/mayil.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 14,
                    LessonId = 7,
                    Title = "உயிர் எழுத்து: 'எ', 'ஏ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'எ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""எ"",
                ""items"": [
                  { ""text"": ""எலி"", ""imageUrl"": ""malaiyar/lesson7/eli.jpg"", ""audioUrl"": ""malaiyar/lesson7/eli.mp3"" },
                  { ""text"": ""எறும்பு"", ""imageUrl"": ""malaiyar/lesson7/erumbu.jpg"", ""audioUrl"": ""malaiyar/lesson7/erumbu.mp3"" },
                  { ""text"": ""எலும்பு"", ""imageUrl"": ""malaiyar/lesson7/elumbu.jpg"", ""audioUrl"": ""malaiyar/lesson7/elumbu.mp3"" }
                ]
              },
              {
                ""title"": ""'ஏ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஏ"",
                ""items"": [
                  { ""text"": ""ஏடு"", ""imageUrl"": ""malaiyar/lesson7/edu.jpg"", ""audioUrl"": ""malaiyar/lesson7/edu.mp3"" },
                  { ""text"": ""ஏணி"", ""imageUrl"": ""malaiyar/lesson7/eni.jpg"", ""audioUrl"": ""malaiyar/lesson7/eni.mp3"" },
                  { ""text"": ""ஏரி"", ""imageUrl"": ""malaiyar/lesson7/eri.jpg"", ""audioUrl"": ""malaiyar/lesson7/eri.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 08: விலங்குகள் (Animals) ---
                new Activity
                {
                    ActivityId = 15,
                    LessonId = 8,
                    Title = "விலங்குகள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""விலங்குகள்"", ""word"": ""ஆடு"", ""imageUrl"": ""malaiyar/lesson8/aadu.jpg"", ""audioUrl"": ""malaiyar/lesson8/aadu.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""மாடு"", ""imageUrl"": ""malaiyar/lesson8/maadu.jpg"", ""audioUrl"": ""malaiyar/lesson8/maadu.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""குதிரை"", ""imageUrl"": ""malaiyar/lesson8/kuthirai.jpg"", ""audioUrl"": ""malaiyar/lesson8/kuthirai.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""நாய்"", ""imageUrl"": ""malaiyar/lesson8/naai.jpg"", ""audioUrl"": ""malaiyar/lesson8/naai.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""பூனை"", ""imageUrl"": ""malaiyar/lesson8/poonai.jpg"", ""audioUrl"": ""malaiyar/lesson8/poonai.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""சிங்கம்"", ""imageUrl"": ""malaiyar/lesson8/singam.jpg"", ""audioUrl"": ""malaiyar/lesson8/singam.mp3"" },
              { ""title"": ""விலங்குகள்"", ""word"": ""யானை"", ""imageUrl"": ""malaiyar/lesson8/yaanai.jpg"", ""audioUrl"": ""malaiyar/lesson8/yaanai.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 16,
                    LessonId = 8,
                    Title = "உயிர் எழுத்து: 'ஐ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""'ஐ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஐ"",
                ""items"": [
                  { ""text"": ""ஐந்து"", ""imageUrl"": ""malaiyar/lesson8/ainthu.jpg"", ""audioUrl"": ""malaiyar/lesson8/ainthu.mp3"" },
                  { ""text"": ""ஐம்பது"", ""imageUrl"": ""malaiyar/lesson8/aimbathu.jpg"", ""audioUrl"": ""malaiyar/lesson8/aimbathu.mp3"" },
                  { ""text"": ""ஐவர்"", ""imageUrl"": ""malaiyar/lesson8/aivar.jpg"", ""audioUrl"": ""malaiyar/lesson8/aivar.mp3"" }
                ]
            }",
                },
                // --- பாடம் 09: விளையாட்டுகள் (Games) ---
                new Activity
                {
                    ActivityId = 17,
                    LessonId = 9,
                    Title = "விளையாட்டுகள்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""விளையாட்டுகள்"", ""word"": ""நீச்சல்"", ""imageUrl"": ""malaiyar/lesson9/neechal.jpg"", ""audioUrl"": ""malaiyar/lesson9/neechal.mp3"" },
              { ""title"": ""விளையாட்டுகள்"", ""word"": ""காற்பந்து"", ""imageUrl"": ""malaiyar/lesson9/kaarpandhu.jpg"", ""audioUrl"": ""malaiyar/lesson9/kaarpandhu.mp3"" },
              { ""title"": ""விளையாட்டுகள்"", ""word"": ""ஓட்டம்"", ""imageUrl"": ""malaiyar/lesson9/ottam.jpg"", ""audioUrl"": ""malaiyar/lesson9/ottam.mp3"" },
              { ""title"": ""விளையாட்டுகள்"", ""word"": ""பட்டம்"", ""imageUrl"": ""malaiyar/lesson9/pattam.jpg"", ""audioUrl"": ""malaiyar/lesson9/pattam.mp3"" },
              { ""title"": ""விளையாட்டுகள்"", ""word"": ""ஊஞ்சல்"", ""imageUrl"": ""malaiyar/lesson9/oonjal.jpg"", ""audioUrl"": ""malaiyar/lesson9/oonjal.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 18,
                    LessonId = 9,
                    Title = "உயிர் எழுத்து: 'ஒ', 'ஓ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ஒ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஒ"",
                ""items"": [
                  { ""text"": ""ஒட்டகம்"", ""imageUrl"": ""malaiyar/lesson9/ottagam.jpg"", ""audioUrl"": ""malaiyar/lesson9/ottagam.mp3"" },
                  { ""text"": ""ஒன்பது"", ""imageUrl"": ""malaiyar/lesson9/onpathu.jpg"", ""audioUrl"": ""malaiyar/lesson9/onpathu.mp3"" },
                  { ""text"": ""ஒன்று"", ""imageUrl"": ""malaiyar/lesson9/ondru.jpg"", ""audioUrl"": ""malaiyar/lesson9/ondru.mp3"" }
                ]
              },
              {
                ""title"": ""'ஓ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஓ"",
                ""items"": [
                  { ""text"": ""ஓநாய்"", ""imageUrl"": ""malaiyar/lesson9/onaai.jpg"", ""audioUrl"": ""malaiyar/lesson9/onaai.mp3"" },
                  { ""text"": ""ஓணான்"", ""imageUrl"": ""malaiyar/lesson9/onaan.jpg"", ""audioUrl"": ""malaiyar/lesson9/onaan.mp3"" },
                  { ""text"": ""ஓடம்"", ""imageUrl"": ""malaiyar/lesson9/odam.jpg"", ""audioUrl"": ""malaiyar/lesson9/odam.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 10: கொண்டாட்டம் (Celebration) ---
                new Activity
                {
                    ActivityId = 19,
                    LessonId = 10,
                    Title = "கொண்டாட்டம்: Flashcards",
                    SequenceOrder = 1,
                    ActivityTypeId = 1,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              { ""title"": ""கொண்டாட்டம்"", ""word"": ""தைப்பொங்கல்"", ""imageUrl"": ""malaiyar/lesson10/thaipongal.jpg"", ""audioUrl"": ""malaiyar/lesson10/thaipongal.mp3"" },
              { ""title"": ""கொண்டாட்டம்"", ""word"": ""புத்தாண்டு"", ""imageUrl"": ""malaiyar/lesson10/puthaandu.jpg"", ""audioUrl"": ""malaiyar/lesson10/puthaandu.mp3"" },
              { ""title"": ""கொண்டாட்டம்"", ""word"": ""பிறந்தநாள்"", ""imageUrl"": ""malaiyar/lesson10/piranthanaal.jpg"", ""audioUrl"": ""malaiyar/lesson10/piranthanaal.mp3"" },
              { ""title"": ""கொண்டாட்டம்"", ""word"": ""திருமணம்"", ""imageUrl"": ""malaiyar/lesson10/thirumanam.jpg"", ""audioUrl"": ""malaiyar/lesson10/thirumanam.mp3"" },
              { ""title"": ""கொண்டாட்டம்"", ""word"": ""திருவிழா"", ""imageUrl"": ""malaiyar/lesson10/thiruvizha.jpg"", ""audioUrl"": ""malaiyar/lesson10/thiruvizha.mp3"" }
            ]",
                },
                new Activity
                {
                    ActivityId = 20,
                    LessonId = 10,
                    Title = "உயிர் எழுத்து: 'ஔ', 'ஃ' சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ஔ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஔ"",
                ""items"": [
                  { ""text"": ""ஔவையார்"", ""imageUrl"": ""malaiyar/lesson10/avvaiyar.jpg"", ""audioUrl"": ""malaiyar/lesson10/avvaiyar.mp3"" },
                  { ""text"": ""ஔவைடதம்"", ""imageUrl"": ""malaiyar/lesson10/avvaidadham.jpg"", ""audioUrl"": ""malaiyar/lesson10/avvaidadham.mp3"" }
                ]
              },
              {
                ""title"": ""'ஃ' ஆயுத எழுத்து"", ""spotlightLetter"": ""ஃ"",
                ""items"": [
                  { ""text"": ""எஃகுவாள்"", ""imageUrl"": ""malaiyar/lesson10/egkuvaal.jpg"", ""audioUrl"": ""malaiyar/lesson10/egkuvaal.mp3"" }
                ]
              }
            ]",
                },
                // =========================================================================
                // == Appended Data for Level 2 (சிறுவர் நிலை) - Kindergarten Lessons
                // =========================================================================

                // --- பாடம் 01: நான் (Myself) ---
                // ActivityId 21 is reserved for the skipped "FlashCards" activity.
                new Activity
                {
                    ActivityId = 22,
                    LessonId = 11,
                    Title = "உயிர் எழுத்துகள்: சொற்கள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'அ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""அ"", ""items"": [
                  { ""text"": ""அலைபேசி"", ""imageUrl"": ""siruvar/lesson1/alaipesi.jpg"", ""audioUrl"": ""siruvar/lesson1/alaipesi.mp3"" },
                  { ""text"": ""அன்பளிப்பு"", ""imageUrl"": ""siruvar/lesson1/anbalippu.jpg"", ""audioUrl"": ""siruvar/lesson1/anbalippu.mp3"" },
                  { ""text"": ""அன்னாசி"", ""imageUrl"": ""siruvar/lesson1/annasi.jpg"", ""audioUrl"": ""siruvar/lesson1/annasi.mp3"" }
                ]
              },
              {
                ""title"": ""'ஆ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஆ"", ""items"": [
                  { ""text"": ""ஆடு"", ""imageUrl"": ""siruvar/lesson1/aadu.jpg"", ""audioUrl"": ""siruvar/lesson1/aadu.mp3"" },
                  { ""text"": ""ஆசிரியர்"", ""imageUrl"": ""siruvar/lesson1/aasiriyar.jpg"", ""audioUrl"": ""siruvar/lesson1/aasiriyar.mp3"" },
                  { ""text"": ""ஆறு"", ""imageUrl"": ""siruvar/lesson1/aaru.jpg"", ""audioUrl"": ""siruvar/lesson1/aaru.mp3"" }
                ]
              },
              {
                ""title"": ""'இ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""இ"", ""items"": [
                  { ""text"": ""இறகு"", ""imageUrl"": ""siruvar/lesson1/iragu.jpg"", ""audioUrl"": ""siruvar/lesson1/iragu.mp3"" },
                  { ""text"": ""இதயம்"", ""imageUrl"": ""siruvar/lesson1/ithayam.jpg"", ""audioUrl"": ""siruvar/lesson1/ithayam.mp3"" },
                  { ""text"": ""இனிப்பு"", ""imageUrl"": ""siruvar/lesson1/inippu.jpg"", ""audioUrl"": ""siruvar/lesson1/inippu.mp3"" }
                ]
              },
              {
                ""title"": ""'ஈ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஈ"", ""items"": [
                  { ""text"": ""ஈச்சமரம்"", ""imageUrl"": ""siruvar/lesson1/eechamaram.jpg"", ""audioUrl"": ""siruvar/lesson1/eechamaram.mp3"" },
                  { ""text"": ""ஈட்டி"", ""imageUrl"": ""siruvar/lesson1/eetti.jpg"", ""audioUrl"": ""siruvar/lesson1/eetti.mp3"" },
                  { ""text"": ""ஈழம்"", ""imageUrl"": ""siruvar/lesson1/eelam.jpg"", ""audioUrl"": ""siruvar/lesson1/eelam.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 02: என் குடும்பம் (My Family) ---
                // ActivityId 23 is reserved.
                new Activity
                {
                    ActivityId = 24,
                    LessonId = 12,
                    Title = "உயிர் எழுத்துகள்: 'உ', 'ஊ'",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'உ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""உ"", ""items"": [
                    { ""text"": ""உணவு"", ""imageUrl"": ""siruvar/lesson2/unavu.jpg"", ""audioUrl"": ""siruvar/lesson2/unavu.mp3"" },
                    { ""text"": ""உப்பு"", ""imageUrl"": ""siruvar/lesson2/uppu.jpg"", ""audioUrl"": ""siruvar/lesson2/uppu.mp3"" },
                    { ""text"": ""உந்துருளி"", ""imageUrl"": ""siruvar/lesson2/unthuruli.jpg"", ""audioUrl"": ""siruvar/lesson2/unthuruli.mp3"" }
                ]
              },
              {
                ""title"": ""'ஊ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஊ"", ""items"": [
                    { ""text"": ""ஊர்"", ""imageUrl"": ""siruvar/lesson2/oor.jpg"", ""audioUrl"": ""siruvar/lesson2/oor.mp3"" },
                    { ""text"": ""ஊசி"", ""imageUrl"": ""siruvar/lesson2/oosi.jpg"", ""audioUrl"": ""siruvar/lesson2/oosi.mp3"" },
                    { ""text"": ""ஊஞ்சல்"", ""imageUrl"": ""siruvar/lesson2/oonjal.jpg"", ""audioUrl"": ""siruvar/lesson2/oonjal.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 03: எனது வீடு (My House) ---
                // ActivityId 25 is reserved.
                new Activity
                {
                    ActivityId = 26,
                    LessonId = 13,
                    Title = "உயிர் எழுத்துகள்: 'எ', 'ஏ'",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'எ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""எ"", ""items"": [
                  { ""text"": ""எலுமிச்சை"", ""imageUrl"": ""siruvar/lesson3/elumichai.jpg"", ""audioUrl"": ""siruvar/lesson3/elumichai.mp3"" },
                  { ""text"": ""எருமை"", ""imageUrl"": ""siruvar/lesson3/erumai.jpg"", ""audioUrl"": ""siruvar/lesson3/erumai.mp3"" },
                  { ""text"": ""எண்ணெய்"", ""imageUrl"": ""siruvar/lesson3/ennai.jpg"", ""audioUrl"": ""siruvar/lesson3/ennai.mp3"" }
                ]
              },
              {
                ""title"": ""'ஏ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஏ"", ""items"": [
                  { ""text"": ""ஏணை"", ""imageUrl"": ""siruvar/lesson3/enai.jpg"", ""audioUrl"": ""siruvar/lesson3/enai.mp3"" },
                  { ""text"": ""ஏலக்காய்"", ""imageUrl"": ""siruvar/lesson3/elakkai.jpg"", ""audioUrl"": ""siruvar/lesson3/elakkai.mp3"" },
                  { ""text"": ""ஏழு"", ""imageUrl"": ""siruvar/lesson3/elu.jpg"", ""audioUrl"": ""siruvar/lesson3/elu.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 04: உணவுகள் (Foods) ---
                // ActivityId 27 is reserved.
                new Activity
                {
                    ActivityId = 28,
                    LessonId = 14,
                    Title = "உயிர் எழுத்துகள்: 'ஐ', 'ஒ', 'ஓ'",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ஐ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஐ"", ""items"": [
                  { ""text"": ""ஐரோப்பா"", ""imageUrl"": ""siruvar/lesson4/europa.jpg"", ""audioUrl"": ""siruvar/lesson4/europa.mp3"" },
                  { ""text"": ""ஐவர்"", ""imageUrl"": ""siruvar/lesson4/aivar.jpg"", ""audioUrl"": ""siruvar/lesson4/aivar.mp3"" },
                  { ""text"": ""ஐவிரல்"", ""imageUrl"": ""siruvar/lesson4/aiviral.jpg"", ""audioUrl"": ""siruvar/lesson4/aiviral.mp3"" }
                ]
              },
              {
                ""title"": ""'ஒ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஒ"", ""items"": [
                  { ""text"": ""ஒன்பது"", ""imageUrl"": ""siruvar/lesson4/onpathu.jpg"", ""audioUrl"": ""siruvar/lesson4/onpathu.mp3"" },
                  { ""text"": ""ஒலிபெருக்கி"", ""imageUrl"": ""siruvar/lesson4/oliperukki.jpg"", ""audioUrl"": ""siruvar/lesson4/oliperukki.mp3"" },
                  { ""text"": ""ஒட்டகச்சிவிங்கி"", ""imageUrl"": ""siruvar/lesson4/ottagachivingi.jpg"", ""audioUrl"": ""siruvar/lesson4/ottagachivingi.mp3"" }
                ]
              },
              {
                ""title"": ""'ஓ' இல் தொடங்கும் சொற்கள்"", ""spotlightLetter"": ""ஓ"", ""items"": [
                  { ""text"": ""ஓநாய்"", ""imageUrl"": ""siruvar/lesson4/onaai.jpg"", ""audioUrl"": ""siruvar/lesson4/onaai.mp3"" },
                  { ""text"": ""ஓவியர்"", ""imageUrl"": ""siruvar/lesson4/oviyar.jpg"", ""audioUrl"": ""siruvar/lesson4/oviyar.mp3"" },
                  { ""text"": ""ஓடை"", ""imageUrl"": ""siruvar/lesson4/odai.jpg"", ""audioUrl"": ""siruvar/lesson4/odai.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 05: உடைகள் (Clothes) ---
                // ActivityId 29 is reserved.
                new Activity
                {
                    ActivityId = 30,
                    LessonId = 15,
                    Title = "மெய்யெழுத்துகள்: க், ங், ச், ஞ்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'க்' சொற்கள்"", ""spotlightLetter"": ""க்"", ""items"": [
                  { ""text"": ""கொக்கு"", ""imageUrl"": ""siruvar/lesson5/kokku.jpg"", ""audioUrl"": ""siruvar/lesson5/kokku.mp3"" },
                  { ""text"": ""பாக்கு"", ""imageUrl"": ""siruvar/lesson5/paakku.jpg"", ""audioUrl"": ""siruvar/lesson5/paakku.mp3"" },
                  { ""text"": ""தக்காளி"", ""imageUrl"": ""siruvar/lesson5/thakkali.jpg"", ""audioUrl"": ""siruvar/lesson5/thakkali.mp3"" }
                ]
              },
              {
                ""title"": ""'ங்' சொற்கள்"", ""spotlightLetter"": ""ங்"", ""items"": [
                  { ""text"": ""சங்கு"", ""imageUrl"": ""siruvar/lesson5/sangu.jpg"", ""audioUrl"": ""siruvar/lesson5/sangu.mp3"" },
                  { ""text"": ""குரங்கு"", ""imageUrl"": ""siruvar/lesson5/kurangu.jpg"", ""audioUrl"": ""siruvar/lesson5/kurangu.mp3"" },
                  { ""text"": ""தங்கம்"", ""imageUrl"": ""siruvar/lesson5/thangam.jpg"", ""audioUrl"": ""siruvar/lesson5/thangam.mp3"" }
                ]
              },
              {
                ""title"": ""'ச்' சொற்கள்"", ""spotlightLetter"": ""ச்"", ""items"": [
                  { ""text"": ""பச்சை"", ""imageUrl"": ""siruvar/lesson5/pachai.jpg"", ""audioUrl"": ""siruvar/lesson5/pachai.mp3"" },
                  { ""text"": ""எலுமிச்சை"", ""imageUrl"": ""siruvar/lesson5/elumichai.jpg"", ""audioUrl"": ""siruvar/lesson5/elumichai.mp3"" },
                  { ""text"": ""நீச்சல்"", ""imageUrl"": ""siruvar/lesson5/neechal.jpg"", ""audioUrl"": ""siruvar/lesson5/neechal.mp3"" }
                ]
              },
              {
                ""title"": ""'ஞ்' சொற்கள்"", ""spotlightLetter"": ""ஞ்"", ""items"": [
                  { ""text"": ""இஞ்சி"", ""imageUrl"": ""siruvar/lesson5/inji.jpg"", ""audioUrl"": ""siruvar/lesson5/inji.mp3"" },
                  { ""text"": ""ஊஞ்சல்"", ""imageUrl"": ""siruvar/lesson5/oonjal.jpg"", ""audioUrl"": ""siruvar/lesson5/oonjal.mp3"" },
                  { ""text"": ""மஞ்சள்"", ""imageUrl"": ""siruvar/lesson5/manjal.jpg"", ""audioUrl"": ""siruvar/lesson5/manjal.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 06: விலங்குகள் (Animals) ---
                // ActivityId 31 is reserved.
                new Activity
                {
                    ActivityId = 32,
                    LessonId = 16,
                    Title = "மெய்யெழுத்துகள்: ட், ண், த், ந்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ட்' சொற்கள்"", ""spotlightLetter"": ""ட்"", ""items"": [
                  { ""text"": ""பட்டம்"", ""imageUrl"": ""siruvar/lesson6/pattam.jpg"", ""audioUrl"": ""siruvar/lesson6/pattam.mp3"" },
                  { ""text"": ""பெட்டி"", ""imageUrl"": ""siruvar/lesson6/petti.jpg"", ""audioUrl"": ""siruvar/lesson6/petti.mp3"" },
                  { ""text"": ""வட்டம்"", ""imageUrl"": ""siruvar/lesson6/vattam.jpg"", ""audioUrl"": ""siruvar/lesson6/vattam.mp3"" }
                ]
              },
              {
                ""title"": ""'ண்' சொற்கள்"", ""spotlightLetter"": ""ண்"", ""items"": [
                  { ""text"": ""நண்டு"", ""imageUrl"": ""siruvar/lesson6/nandu.jpg"", ""audioUrl"": ""siruvar/lesson6/nandu.mp3"" },
                  { ""text"": ""வண்டு"", ""imageUrl"": ""siruvar/lesson6/vandu.jpg"", ""audioUrl"": ""siruvar/lesson6/vandu.mp3"" },
                  { ""text"": ""மண்"", ""imageUrl"": ""siruvar/lesson6/mann.jpg"", ""audioUrl"": ""siruvar/lesson6/mann.mp3"" }
                ]
              },
              {
                ""title"": ""'த்' சொற்கள்"", ""spotlightLetter"": ""த்"", ""items"": [
                  { ""text"": ""பத்து"", ""imageUrl"": ""siruvar/lesson6/pathu.jpg"", ""audioUrl"": ""siruvar/lesson6/pathu.mp3"" },
                  { ""text"": ""வாத்து"", ""imageUrl"": ""siruvar/lesson6/vaathu.jpg"", ""audioUrl"": ""siruvar/lesson6/vaathu.mp3"" },
                  { ""text"": ""நத்தை"", ""imageUrl"": ""siruvar/lesson6/nathai.jpg"", ""audioUrl"": ""siruvar/lesson6/nathai.mp3"" }
                ]
              },
              {
                ""title"": ""'ந்' சொற்கள்"", ""spotlightLetter"": ""ந்"", ""items"": [
                  { ""text"": ""பந்து"", ""imageUrl"": ""siruvar/lesson6/panthu.jpg"", ""audioUrl"": ""siruvar/lesson6/panthu.mp3"" },
                  { ""text"": ""ஆந்தை"", ""imageUrl"": ""siruvar/lesson6/aanthai.jpg"", ""audioUrl"": ""siruvar/lesson6/aanthai.mp3"" },
                  { ""text"": ""தந்தம்"", ""imageUrl"": ""siruvar/lesson6/thantham.jpg"", ""audioUrl"": ""siruvar/lesson6/thantham.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 07: பிறந்தநாள் (Birthday) ---
                // ActivityId 33 is reserved.
                new Activity
                {
                    ActivityId = 34,
                    LessonId = 17,
                    Title = "மெய்யெழுத்துகள்: ப், ம், ய், ர்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ப்' சொற்கள்"", ""spotlightLetter"": ""ப்"", ""items"": [
                  { ""text"": ""சீப்பு"", ""imageUrl"": ""siruvar/lesson7/seeppu.jpg"", ""audioUrl"": ""siruvar/lesson7/seeppu.mp3"" },
                  { ""text"": ""பப்பாசி"", ""imageUrl"": ""siruvar/lesson7/pappasi.jpg"", ""audioUrl"": ""siruvar/lesson7/pappasi.mp3"" },
                  { ""text"": ""கப்பல்"", ""imageUrl"": ""siruvar/lesson7/kappal.jpg"", ""audioUrl"": ""siruvar/lesson7/kappal.mp3"" }
                ]
              },
              {
                ""title"": ""'ம்' சொற்கள்"", ""spotlightLetter"": ""ம்"", ""items"": [
                  { ""text"": ""மரம்"", ""imageUrl"": ""siruvar/lesson7/maram.jpg"", ""audioUrl"": ""siruvar/lesson7/maram.mp3"" },
                  { ""text"": ""மாம்பழம்"", ""imageUrl"": ""siruvar/lesson7/maampazham.jpg"", ""audioUrl"": ""siruvar/lesson7/maampazham.mp3"" },
                  { ""text"": ""பாம்பு"", ""imageUrl"": ""siruvar/lesson7/paambu.jpg"", ""audioUrl"": ""siruvar/lesson7/paambu.mp3"" }
                ]
              },
              {
                ""title"": ""'ய்' சொற்கள்"", ""spotlightLetter"": ""ய்"", ""items"": [
                  { ""text"": ""நாய்"", ""imageUrl"": ""siruvar/lesson7/naai.jpg"", ""audioUrl"": ""siruvar/lesson7/naai.mp3"" },
                  { ""text"": ""தாய்"", ""imageUrl"": ""siruvar/lesson7/thaai.jpg"", ""audioUrl"": ""siruvar/lesson7/thaai.mp3"" },
                  { ""text"": ""மாங்காய்"", ""imageUrl"": ""siruvar/lesson7/maangaai.jpg"", ""audioUrl"": ""siruvar/lesson7/maangaai.mp3"" }
                ]
              },
              {
                ""title"": ""'ர்' சொற்கள்"", ""spotlightLetter"": ""ர்"", ""items"": [
                  { ""text"": ""ஏர்"", ""imageUrl"": ""siruvar/lesson7/aer.jpg"", ""audioUrl"": ""siruvar/lesson7/aer.mp3"" },
                  { ""text"": ""வேர்"", ""imageUrl"": ""siruvar/lesson7/vaer.jpg"", ""audioUrl"": ""siruvar/lesson7/vaer.mp3"" },
                  { ""text"": ""ஆசிரியர்"", ""imageUrl"": ""siruvar/lesson7/aasiriyar.jpg"", ""audioUrl"": ""siruvar/lesson7/aasiriyar.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 08: வகுப்பறை (Classroom) ---
                // ActivityId 35 is reserved.
                new Activity
                {
                    ActivityId = 36,
                    LessonId = 18,
                    Title = "மெய்யெழுத்துகள்: ல், வ், ழ், ள்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ல்' சொற்கள்"", ""spotlightLetter"": ""ல்"", ""items"": [
                  { ""text"": ""மயில்"", ""imageUrl"": ""siruvar/lesson8/mayil.jpg"", ""audioUrl"": ""siruvar/lesson8/mayil.mp3"" },
                  { ""text"": ""சேவல்"", ""imageUrl"": ""siruvar/lesson8/seval.jpg"", ""audioUrl"": ""siruvar/lesson8/seval.mp3"" },
                  { ""text"": ""கால்"", ""imageUrl"": ""siruvar/lesson8/kaal.jpg"", ""audioUrl"": ""siruvar/lesson8/kaal.mp3"" }
                ]
              },
              {
                ""title"": ""'வ்' சொற்கள்"", ""spotlightLetter"": ""வ்"", ""items"": [
                  { ""text"": ""செவ்வாழை"", ""imageUrl"": ""siruvar/lesson8/sevvalai.jpg"", ""audioUrl"": ""siruvar/lesson8/sevvalai.mp3"" },
                  { ""text"": ""செவ்வகம்"", ""imageUrl"": ""siruvar/lesson8/sevvagam.jpg"", ""audioUrl"": ""siruvar/lesson8/sevvagam.mp3"" },
                  { ""text"": ""செவ்வந்தி"", ""imageUrl"": ""siruvar/lesson8/sevvanthi.jpg"", ""audioUrl"": ""siruvar/lesson8/sevvanthi.mp3"" }
                ]
              },
              {
                ""title"": ""'ழ்' சொற்கள்"", ""spotlightLetter"": ""ழ்"", ""items"": [
                  { ""text"": ""தாழ்ப்பாழ்"", ""imageUrl"": ""siruvar/lesson8/thaalpaal.jpg"", ""audioUrl"": ""siruvar/lesson8/thaalpaal.mp3"" },
                  { ""text"": ""யாழ்"", ""imageUrl"": ""siruvar/lesson8/yaal.jpg"", ""audioUrl"": ""siruvar/lesson8/yaal.mp3"" },
                  { ""text"": ""தமிழ்"", ""imageUrl"": ""siruvar/lesson8/tamil.jpg"", ""audioUrl"": ""siruvar/lesson8/tamil.mp3"" }
                ]
              },
              {
                ""title"": ""'ள்' சொற்கள்"", ""spotlightLetter"": ""ள்"", ""items"": [
                  { ""text"": ""வாள்"", ""imageUrl"": ""siruvar/lesson8/vaal.jpg"", ""audioUrl"": ""siruvar/lesson8/vaal.mp3"" },
                  { ""text"": ""தேள்"", ""imageUrl"": ""siruvar/lesson8/thel.jpg"", ""audioUrl"": ""siruvar/lesson8/thel.mp3"" },
                  { ""text"": ""பள்ளி"", ""imageUrl"": ""siruvar/lesson8/palli.jpg"", ""audioUrl"": ""siruvar/lesson8/palli.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 09: உந்துகள் (Vehicles) ---
                // ActivityId 37 is reserved.
                new Activity
                {
                    ActivityId = 38,
                    LessonId = 19,
                    Title = "மெய்யெழுத்துகள்: ற், ன்",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"[
              {
                ""title"": ""'ற்' சொற்கள்"", ""spotlightLetter"": ""ற்"", ""items"": [
                  { ""text"": ""பாகற்காய்"", ""imageUrl"": ""siruvar/lesson9/pagarkai.jpg"", ""audioUrl"": ""siruvar/lesson9/pagarkai.mp3"" },
                  { ""text"": ""காற்றாடி"", ""imageUrl"": ""siruvar/lesson9/kaatradi.jpg"", ""audioUrl"": ""siruvar/lesson9/kaatradi.mp3"" },
                  { ""text"": ""நெற்றி"", ""imageUrl"": ""siruvar/lesson9/netri.jpg"", ""audioUrl"": ""siruvar/lesson9/netri.mp3"" }
                ]
              },
              {
                ""title"": ""'ன்' சொற்கள்"", ""spotlightLetter"": ""ன்"", ""items"": [
                  { ""text"": ""மீன்"", ""imageUrl"": ""siruvar/lesson9/meen.jpg"", ""audioUrl"": ""siruvar/lesson9/meen.mp3"" },
                  { ""text"": ""காளான்"", ""imageUrl"": ""siruvar/lesson9/kaalaan.jpg"", ""audioUrl"": ""siruvar/lesson9/kaalaan.mp3"" },
                  { ""text"": ""மூன்று"", ""imageUrl"": ""siruvar/lesson9/moondru.jpg"", ""audioUrl"": ""siruvar/lesson9/moondru.mp3"" }
                ]
              }
            ]",
                },
                // --- பாடம் 10: விளையாட்டு (Play/Game) ---
                // ActivityId 39 is reserved.
                new Activity
                {
                    ActivityId = 40,
                    LessonId = 20,
                    Title = "எழுத்துகள் பயிற்சி",
                    SequenceOrder = 2,
                    ActivityTypeId = 2,
                    MainActivityId = 3,
                    ContentJson =
                        @"{
                ""title"": ""எழுத்துகள் மீள்பார்வை"", ""spotlightLetter"": ""அ"", ""items"": [
                  { ""text"": ""அம்மா"", ""imageUrl"": ""siruvar/lesson10/amma.jpg"", ""audioUrl"": ""siruvar/lesson10/amma.mp3"" },
                  { ""text"": ""ஆடு"", ""imageUrl"": ""siruvar/lesson10/aadu.jpg"", ""audioUrl"": ""siruvar/lesson10/aadu.mp3"" },
                  { ""text"": ""இலை"", ""imageUrl"": ""siruvar/lesson10/ilai.jpg"", ""audioUrl"": ""siruvar/lesson10/ilai.mp3"" },
                  { ""text"": ""ஈட்டி"", ""imageUrl"": ""siruvar/lesson10/eetti.jpg"", ""audioUrl"": ""siruvar/lesson10/eetti.mp3"" },
                  { ""text"": ""உரல்"", ""imageUrl"": ""siruvar/lesson10/ural.jpg"", ""audioUrl"": ""siruvar/lesson10/ural.mp3"" },
                  { ""text"": ""ஊஞ்சல்"", ""imageUrl"": ""siruvar/lesson10/oonjal.jpg"", ""audioUrl"": ""siruvar/lesson10/oonjal.mp3"" }
                ]
            }",
                }
            // =========================================================================
            // == Appended Data for Level 3 (சிறுவர் நிலை) - Kindergarten Lessons
            // =========================================================================
            );
        }
    }
}
