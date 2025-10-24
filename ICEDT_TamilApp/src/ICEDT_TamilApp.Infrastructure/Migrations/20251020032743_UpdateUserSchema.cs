using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ICEDT_TamilApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_ActivityTypes_ActivityTypeId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCurrentProgresses_Users_UserId",
                table: "UserCurrentProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserProgresses",
                table: "UserProgresses");

            // Check if index exists before dropping
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_Lessons_LevelId;");

            // Check if index exists before dropping
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_Activities_LessonId;");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserCurrentProgresses",
                table: "UserCurrentProgresses");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Levels");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Levels");

            migrationBuilder.DropColumn(
                name: "ActivityName",
                table: "ActivityTypes");

            migrationBuilder.DropColumn(
                name: "CurrentLevelId",
                table: "UserCurrentProgresses");

            // Check if table exists before renaming
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS UserCurrentProgress AS 
                SELECT * FROM UserCurrentProgresses WHERE 1=0;
                DROP TABLE IF EXISTS UserCurrentProgresses;
            ");

            migrationBuilder.RenameColumn(
                name: "ProgressId",
                table: "UserProgresses",
                newName: "MaxScore");

            migrationBuilder.RenameColumn(
                name: "LastUpdated",
                table: "UserCurrentProgress",
                newName: "LastActivityAt");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "UserProgresses",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "MaxScore",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "UserProgressId",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "Attempts",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "UserProgresses",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LearningStage",
                table: "UserProgresses",
                type: "TEXT",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LevelId",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MainActivityId",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ProgressData",
                table: "UserProgresses",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "UserProgresses",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "Levels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Lessons",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LessonImageUrl",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ActivityTypes",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "UserCurrentProgress",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserProgresses",
                table: "UserProgresses",
                column: "UserProgressId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserCurrentProgress",
                table: "UserCurrentProgress",
                column: "UserId");

            migrationBuilder.InsertData(
                table: "ActivityTypes",
                columns: new[] { "ActivityTypeId", "Name" },
                values: new object[,]
                {
                    { 1, "FlashCards" },
                    { 2, "VocabularySpotlight" },
                    { 3, "MediaSpotLight" },
                    { 4, "Equations" }
                });

            migrationBuilder.InsertData(
                table: "Levels",
                columns: new[] { "LevelId", "Barcode", "CoverImageUrl", "LevelName", "SequenceOrder", "Slug" },
                values: new object[,]
                {
                    { 1, "malalaiyar-nilai", null, "மழலையர் நிலை", 1, "malalaiyar-nilai" },
                    { 2, "siruvar-nilai", null, "சிறுவர் நிலை", 2, "siruvar-nilai" },
                    { 3, "aandu-01", null, "ஆண்டு 01", 3, "aandu-01" },
                    { 4, "aandu-02", null, "ஆண்டு 02", 4, "aandu-02" },
                    { 5, "aandu-03", null, "ஆண்டு 03", 5, "aandu-03" },
                    { 6, "aandu-04", null, "ஆண்டு 04", 6, "aandu-04" },
                    { 7, "aandu-05", null, "ஆண்டு 05", 7, "aandu-05" }
                });

            migrationBuilder.InsertData(
                table: "MainActivities",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Video" },
                    { 2, "Sounds" },
                    { 3, "Learning" },
                    { 4, "Exercises" }
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "LessonId", "Description", "LessonImageUrl", "LessonName", "LevelId", "SequenceOrder", "Slug" },
                values: new object[,]
                {
                    { 1, "Basic body parts", null, "பாடம் 01: உடல் உறுப்புகள்", 1, 1, "malalaiyar-udal-uruppukal" },
                    { 2, "Immediate family members", null, "பாடம் 02: எனது குடும்பம்", 1, 2, "malalaiyar-enathu-kudumbam" },
                    { 3, "Parts of a house", null, "பாடம் 03: எனது வீடு", 1, 3, "malalaiyar-enathu-veedu" },
                    { 4, "Common foods and tastes", null, "பாடம் 04: உணவுகள்", 1, 4, "malalaiyar-unavugal" },
                    { 5, "Colors", null, "பாடம் 05: வண்ணங்கள்", 1, 5, "malalaiyar-vannangal" },
                    { 6, "Flowers", null, "பாடம் 06: பூக்கள்", 1, 6, "malalaiyar-pookkal" },
                    { 7, "Birds", null, "பாடம் 07: பறவைகள்", 1, 7, "malalaiyar-paravaigal" },
                    { 8, "Animals", null, "பாடம் 08: விலங்குகள்", 1, 8, "malalaiyar-vilangugal" },
                    { 9, "Games and play", null, "பாடம் 09: விளையாட்டுகள்", 1, 9, "malalaiyar-vilaiyattukal" },
                    { 10, "Celebrations", null, "பாடம் 10: கொண்டாட்டம்", 1, 10, "malalaiyar-kondaattam" },
                    { 11, "Myself and body parts", null, "பாடம் 01: நான்", 2, 1, "siruvar-naan" },
                    { 12, "Extended family", null, "பாடம் 02: என் குடும்பம்", 2, 2, "siruvar-en-kudumbam" },
                    { 13, "Rooms in a house", null, "பாடம் 03: எனது வீடு", 2, 3, "siruvar-enathu-veedu" },
                    { 14, "Food types including seafood", null, "பாடம் 04: உணவுகள்", 2, 4, "siruvar-unavugal" },
                    { 15, "Clothing", null, "பாடம் 05: உடைகள்", 2, 5, "siruvar-udaigal" },
                    { 16, "Wild animals", null, "பாடம் 06: விலங்குகள்", 2, 6, "siruvar-vilangugal" },
                    { 17, "Birthday celebrations", null, "பாடம் 07: பிறந்தநாள்", 2, 7, "siruvar-piranthanaal" },
                    { 18, "Classroom items", null, "பாடம் 08: வகுப்பறை", 2, 8, "siruvar-vagupparai" },
                    { 19, "Vehicles", null, "பாடம் 09: உந்துகள்", 2, 9, "siruvar-unthugal" },
                    { 20, "Verbs for play", null, "பாடம் 10: விளையாட்டு", 2, 10, "siruvar-vilaiyattu" },
                    { 21, "The Tamil school", null, "பாடம் 01: தமிழ்ப்பள்ளி", 3, 1, "aandu-01-paadam-01" },
                    { 22, "Vacation", null, "பாடம் 02: விடுமுறை", 3, 2, "aandu-01-paadam-02" },
                    { 23, "Friends", null, "பாடம் 03: நண்பர்கள்", 3, 3, "aandu-01-paadam-03" },
                    { 24, "Mother's Day", null, "பாடம் 04: அன்னையர் நாள்", 3, 4, "aandu-01-paadam-04" },
                    { 25, "Thai Pongal festival", null, "பாடம் 05: தைப்பொங்கல்", 3, 5, "aandu-01-paadam-05" },
                    { 26, "The Market", null, "பாடம் 06: அங்காடி", 3, 6, "aandu-01-paadam-06" },
                    { 27, "Domestic Animals", null, "பாடம் 07: வீட்டு விலங்குகள்", 3, 7, "aandu-01-paadam-07" },
                    { 28, "Winter Season", null, "பாடம் 08: பனி காலம்", 3, 8, "aandu-01-paadam-08" },
                    { 29, "Balanced Diet", null, "பாடம் 09: நிறையுணவு", 3, 9, "aandu-01-paadam-09" },
                    { 30, "Days and Months", null, "பாடம் 10: நாள்கள், மாதங்கள்", 3, 10, "aandu-01-paadam-10" },
                    { 31, "The Tamil Language", null, "பாடம் 01: தமிழ்மொழி", 4, 1, "aandu-02-paadam-01" },
                    { 32, "Our Motherland", null, "பாடம் 02: எங்கள் தாயகம்", 4, 2, "aandu-02-paadam-02" },
                    { 33, "Fine Arts", null, "பாடம் 03: இன்கலைகள்", 4, 3, "aandu-02-paadam-03" },
                    { 34, "Community Helpers", null, "பாடம் 04: கை கொடுப்போம்", 4, 4, "aandu-02-paadam-04" },
                    { 35, "King Cankiliyan", null, "பாடம் 05: சங்கிலியன்", 4, 5, "aandu-02-paadam-05" },
                    { 36, "Seasons", null, "பாடம் 06: பருவகாலங்கள்", 4, 6, "aandu-02-paadam-06" },
                    { 37, "Our Environment", null, "பாடம் 07: நாம் வாழும் சூழல்", 4, 7, "aandu-02-paadam-07" },
                    { 38, "Poet Somasundara Pulavar", null, "பாடம் 08: சோமசுந்தரப் புலவர்", 4, 8, "aandu-02-paadam-08" },
                    { 39, "Palmyra Tree", null, "பாடம் 09: பனைமரம்", 4, 9, "aandu-02-paadam-09" },
                    { 40, "Poet Avvaiyar", null, "பாடம் 10: ஔவையார்", 4, 10, "aandu-02-paadam-10" },
                    { 41, "Respecting Elders", null, "பாடம் 11: மூத்தோரை மதிப்போம்", 4, 11, "aandu-02-paadam-11" },
                    { 42, "Outer Space", null, "பாடம் 12: விண்வெளி", 4, 12, "aandu-02-paadam-12" },
                    { 43, "Our Language", null, "பாடம் 01: எமது மொழி", 5, 1, "aandu-03-paadam-01" },
                    { 44, "The Three Great Fruits", null, "பாடம் 02: முக்கனிகள்", 5, 2, "aandu-03-paadam-02" },
                    { 45, "Charity", null, "பாடம் 03: கொடை", 5, 3, "aandu-03-paadam-03" },
                    { 46, "Unity", null, "பாடம் 04: ஒற்றுமை", 5, 4, "aandu-03-paadam-04" },
                    { 47, "Batticaloa", null, "பாடம் 05: மட்டக்களப்பு", 5, 5, "aandu-03-paadam-05" },
                    { 48, "Pandara Vanniyan", null, "பாடம் 06: பண்டாரவன்னியன்", 5, 6, "aandu-03-paadam-06" },
                    { 49, "Folk Songs", null, "பாடம் 07: நாட்டார் பாடல்கள்", 5, 7, "aandu-03-paadam-07" },
                    { 50, "Thiruvalluvar", null, "பாடம் 08: திருவள்ளுவர்", 5, 8, "aandu-03-paadam-08" },
                    { 51, "Our Kite", null, "பாடம் 09: எங்கள் பட்டம்", 5, 9, "aandu-03-paadam-09" },
                    { 52, "Kallanai Dam", null, "பாடம் 10: கல்லணை", 5, 10, "aandu-03-paadam-10" },
                    { 53, "Water", null, "பாடம் 11: தண்ணீர்", 5, 11, "aandu-03-paadam-11" },
                    { 54, "Kilithattu Game", null, "பாடம் 12: கிளித்தட்டு", 5, 12, "aandu-03-paadam-12" },
                    { 55, "Tamil Language Deep Dive", null, "பாடம் 01: தமிழ்மொழி", 6, 1, "aandu-04-paadam-01" },
                    { 56, "Language Exercises", null, "பாடம் 02: மொழிப்பயிற்சி", 6, 2, "aandu-04-paadam-02" },
                    { 57, "The Greatness of Education", null, "பாடம் 03: கல்வியின் சிறப்பு", 6, 3, "aandu-04-paadam-03" },
                    { 58, "Grammatical Gender", null, "பாடம் 04: பால்", 6, 4, "aandu-04-paadam-04" },
                    { 59, "Communication", null, "பாடம் 05: தொடர்பாடல்", 6, 5, "aandu-04-paadam-05" },
                    { 60, "Aadi Pirappu festival", null, "பாடம் 06: ஆடிப்பிறப்பு", 6, 6, "aandu-04-paadam-06" },
                    { 61, "The Library", null, "பாடம் 07: நூலகம்", 6, 7, "aandu-04-paadam-07" },
                    { 62, "Musical Instruments", null, "பாடம் 08: இசைக்கருவிகள்", 6, 8, "aandu-04-paadam-08" },
                    { 63, "Trincomalee", null, "பாடம் 09: திருகோணமலை", 6, 9, "aandu-04-paadam-09" },
                    { 64, "Winter", null, "பாடம் 10: குளிர்காலம்", 6, 10, "aandu-04-paadam-10" },
                    { 65, "The Power of Truth", null, "பாடம் 11: உண்மையின் உயர்வு", 6, 11, "aandu-04-paadam-11" },
                    { 66, "Hero Stones", null, "பாடம் 12: நடுகல்", 6, 12, "aandu-04-paadam-12" },
                    { 67, "Tamil Arts", null, "பாடம் 01: தமிழர் கலைகள்", 7, 1, "aandu-05-paadam-01" },
                    { 68, "Discipline", null, "பாடம் 02: ஒழுக்கம்", 7, 2, "aandu-05-paadam-02" },
                    { 69, "Friendship", null, "பாடம் 03: நட்பு", 7, 3, "aandu-05-paadam-03" },
                    { 70, "Poet Bharathiyar", null, "பாடம் 04: பாரதியார்", 7, 4, "aandu-05-paadam-04" },
                    { 71, "Ilango Adigal", null, "பாடம் 05: இளங்கோ அடிகள்", 7, 5, "aandu-05-paadam-05" },
                    { 72, "Newspaper", null, "பாடம் 06: செய்தித்தாள்", 7, 6, "aandu-05-paadam-06" },
                    { 73, "Thai Thirunaal", null, "பாடம் 07: தைத்திருநாள்", 7, 7, "aandu-05-paadam-07" },
                    { 74, "Pavalakodi", null, "பாடம் 08: பவளக்கொடி", 7, 8, "aandu-05-paadam-08" },
                    { 75, "Mannar", null, "பாடம் 09: மன்னார்", 7, 9, "aandu-05-paadam-09" },
                    { 76, "A Healthy Life", null, "பாடம் 10: நோயற்ற வாழ்வு", 7, 10, "aandu-05-paadam-10" },
                    { 77, "Heroism", null, "பாடம் 11: மாவீரம்", 7, 11, "aandu-05-paadam-11" },
                    { 78, "The Olympics", null, "பாடம் 12: ஒலிம்பிக்", 7, 12, "aandu-05-paadam-12" }
                });

            migrationBuilder.InsertData(
                table: "Activities",
                columns: new[] { "ActivityId", "ActivityTypeId", "ContentJson", "LessonId", "MainActivityId", "SequenceOrder", "Title" },
                values: new object[,]
                {
                    { 1, 1, "[\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"கண்\", \"imageUrl\": \"malaiyar/lesson1/kan.jpg\", \"audioUrl\": \"malaiyar/lesson1/kan.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"காது\", \"imageUrl\": \"malaiyar/lesson1/kaathu.jpg\", \"audioUrl\": \"malaiyar/lesson1/kaathu.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"முகம்\", \"imageUrl\": \"malaiyar/lesson1/mugam.jpg\", \"audioUrl\": \"malaiyar/lesson1/mugam.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"வாய்\", \"imageUrl\": \"malaiyar/lesson1/vaai.jpg\", \"audioUrl\": \"malaiyar/lesson1/vaai.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"மூக்கு\", \"imageUrl\": \"malaiyar/lesson1/mooku.jpg\", \"audioUrl\": \"malaiyar/lesson1/mooku.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"கை\", \"imageUrl\": \"malaiyar/lesson1/kai.jpg\", \"audioUrl\": \"malaiyar/lesson1/kai.mp3\" },\r\n              { \"title\": \"உடல் உறுப்புகள் (நான்)\", \"word\": \"கால்\", \"imageUrl\": \"malaiyar/lesson1/kaal.jpg\", \"audioUrl\": \"malaiyar/lesson1/kaal.mp3\" }\r\n            ]", 1, 3, 1, "உடல் உறுப்புகள்: Flashcards" },
                    { 2, 2, "{\r\n                \"title\": \"'அ' வில் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"அ\",\r\n                \"items\": [\r\n                  { \"text\": \"அம்மா\", \"imageUrl\": \"malaiyar/lesson1/amma.jpg\", \"audioUrl\": \"malaiyar/lesson1/amma.mp3\" },\r\n                  { \"text\": \"அரிசி\", \"imageUrl\": \"malaiyar/lesson1/arisi.jpg\", \"audioUrl\": \"malaiyar/lesson1/arisi.mp3\" },\r\n                  { \"text\": \"அன்னம்\", \"imageUrl\": \"malaiyar/lesson1/annam.jpg\", \"audioUrl\": \"malaiyar/lesson1/annam.mp3\" },\r\n                  { \"text\": \"அடுப்பு\", \"imageUrl\": \"malaiyar/lesson1/aduppu.jpg\", \"audioUrl\": \"malaiyar/lesson1/aduppu.mp3\" },\r\n                  { \"text\": \"அருவி\", \"imageUrl\": \"malaiyar/lesson1/aruvi.jpg\", \"audioUrl\": \"malaiyar/lesson1/aruvi.mp3\" }\r\n                ]\r\n            }", 1, 3, 2, "உயிர் எழுத்து: 'அ' சொற்கள்" },
                    { 3, 1, "[\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"அம்மா\", \"imageUrl\": \"malaiyar/lesson2/amma.jpg\", \"audioUrl\": \"malaiyar/lesson2/amma.mp3\" },\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"அப்பா\", \"imageUrl\": \"malaiyar/lesson2/appa.jpg\", \"audioUrl\": \"malaiyar/lesson2/appa.mp3\" },\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"அக்கா\", \"imageUrl\": \"malaiyar/lesson2/akka.jpg\", \"audioUrl\": \"malaiyar/lesson2/akka.mp3\" },\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"அண்ணா\", \"imageUrl\": \"malaiyar/lesson2/anna.jpg\", \"audioUrl\": \"malaiyar/lesson2/anna.mp3\" },\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"தம்பி\", \"imageUrl\": \"malaiyar/lesson2/thambi.jpg\", \"audioUrl\": \"malaiyar/lesson2/thambi.mp3\" },\r\n              { \"title\": \"எனது குடும்பம்\", \"word\": \"தங்கை\", \"imageUrl\": \"malaiyar/lesson2/thangai.jpg\", \"audioUrl\": \"malaiyar/lesson2/thangai.mp3\" }\r\n            ]", 2, 3, 1, "எனது குடும்பம்: Flashcards" },
                    { 4, 2, "{\r\n                \"title\": \"'ஆ' வில் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஆ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஆடு\", \"imageUrl\": \"malaiyar/lesson2/aadu.jpg\", \"audioUrl\": \"malaiyar/lesson2/aadu.mp3\" },\r\n                  { \"text\": \"ஆமை\", \"imageUrl\": \"malaiyar/lesson2/aamai.jpg\", \"audioUrl\": \"malaiyar/lesson2/aamai.mp3\" },\r\n                  { \"text\": \"ஆந்தை\", \"imageUrl\": \"malaiyar/lesson2/aanthai.jpg\", \"audioUrl\": \"malaiyar/lesson2/aanthai.mp3\" },\r\n                  { \"text\": \"ஆலமரம்\", \"imageUrl\": \"malaiyar/lesson2/aalamaram.jpg\", \"audioUrl\": \"malaiyar/lesson2/aalamaram.mp3\" },\r\n                  { \"text\": \"ஆறு\", \"imageUrl\": \"malaiyar/lesson2/aaru.jpg\", \"audioUrl\": \"malaiyar/lesson2/aaru.mp3\" }\r\n                ]\r\n            }", 2, 3, 2, "உயிர் எழுத்து: 'ஆ' சொற்கள்" },
                    { 5, 1, "[\r\n              { \"title\": \"எனது வீடு\", \"word\": \"கூரை\", \"imageUrl\": \"malaiyar/lesson3/koorai.jpg\", \"audioUrl\": \"malaiyar/lesson3/koorai.mp3\" },\r\n              { \"title\": \"எனது வீடு\", \"word\": \"சாளரம்\", \"imageUrl\": \"malaiyar/lesson3/saalaram.jpg\", \"audioUrl\": \"malaiyar/lesson3/saalaram.mp3\" },\r\n              { \"title\": \"எனது வீடு\", \"word\": \"கதவு\", \"imageUrl\": \"malaiyar/lesson3/kathavu.jpg\", \"audioUrl\": \"malaiyar/lesson3/kathavu.mp3\" },\r\n              { \"title\": \"எனது வீடு\", \"word\": \"சுவர்\", \"imageUrl\": \"malaiyar/lesson3/suvar.jpg\", \"audioUrl\": \"malaiyar/lesson3/suvar.mp3\" },\r\n              { \"title\": \"எனது வீடு\", \"word\": \"சமையலறை\", \"imageUrl\": \"malaiyar/lesson3/samayalarai.jpg\", \"audioUrl\": \"malaiyar/lesson3/samayalarai.mp3\" },\r\n              { \"title\": \"எனது வீடு\", \"word\": \"படுக்கையறை\", \"imageUrl\": \"malaiyar/lesson3/padukkaiyarai.jpg\", \"audioUrl\": \"malaiyar/lesson3/padukkaiyarai.mp3\" }\r\n            ]", 3, 3, 1, "எனது வீடு: Flashcards" },
                    { 6, 2, "{\r\n                \"title\": \"'இ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"இ\",\r\n                \"items\": [\r\n                  { \"text\": \"இலை\", \"imageUrl\": \"malaiyar/lesson3/ilai.jpg\", \"audioUrl\": \"malaiyar/lesson3/ilai.mp3\" },\r\n                  { \"text\": \"இறகு\", \"imageUrl\": \"malaiyar/lesson3/iragu.jpg\", \"audioUrl\": \"malaiyar/lesson3/iragu.mp3\" },\r\n                  { \"text\": \"இரவு\", \"imageUrl\": \"malaiyar/lesson3/iravu.jpg\", \"audioUrl\": \"malaiyar/lesson3/iravu.mp3\" },\r\n                  { \"text\": \"இனிப்பு\", \"imageUrl\": \"malaiyar/lesson3/inippu.jpg\", \"audioUrl\": \"malaiyar/lesson3/inippu.mp3\" },\r\n                  { \"text\": \"இரும்பு\", \"imageUrl\": \"malaiyar/lesson3/irumbu.jpg\", \"audioUrl\": \"malaiyar/lesson3/irumbu.mp3\" }\r\n                ]\r\n            }", 3, 3, 2, "உயிர் எழுத்து: 'இ' சொற்கள்" },
                    { 7, 1, "[\r\n              { \"title\": \"உணவுகள்\", \"word\": \"சோறு\", \"imageUrl\": \"malaiyar/lesson4/soru.jpg\", \"audioUrl\": \"malaiyar/lesson4/soru.mp3\" },\r\n              { \"title\": \"உணவுகள்\", \"word\": \"பிட்டு\", \"imageUrl\": \"malaiyar/lesson4/pittu.jpg\", \"audioUrl\": \"malaiyar/lesson4/pittu.mp3\" },\r\n              { \"title\": \"உணவுகள்\", \"word\": \"இட்டலி\", \"imageUrl\": \"malaiyar/lesson4/iddali.jpg\", \"audioUrl\": \"malaiyar/lesson4/iddali.mp3\" },\r\n              { \"title\": \"உணவுகள்\", \"word\": \"தோசை\", \"imageUrl\": \"malaiyar/lesson4/thosai.jpg\", \"audioUrl\": \"malaiyar/lesson4/thosai.mp3\" },\r\n              { \"title\": \"உணவுகள்\", \"word\": \"இடியப்பம்\", \"imageUrl\": \"malaiyar/lesson4/idiyappam.jpg\", \"audioUrl\": \"malaiyar/lesson4/idiyappam.mp3\" },\r\n              { \"title\": \"உணவுகள்\", \"word\": \"கறி\", \"imageUrl\": \"malaiyar/lesson4/curry.jpg\", \"audioUrl\": \"malaiyar/lesson4/curry.mp3\" }\r\n            ]", 4, 3, 1, "உணவுகள்: Flashcards" },
                    { 8, 2, "{\r\n                \"title\": \"'ஈ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஈ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஈழம்\", \"imageUrl\": \"malaiyar/lesson4/eelam.jpg\", \"audioUrl\": \"malaiyar/lesson4/eelam.mp3\" },\r\n                  { \"text\": \"ஈட்டி\", \"imageUrl\": \"malaiyar/lesson4/eetti.jpg\", \"audioUrl\": \"malaiyar/lesson4/eetti.mp3\" },\r\n                  { \"text\": \"ஈ\", \"imageUrl\": \"malaiyar/lesson4/ee.jpg\", \"audioUrl\": \"malaiyar/lesson4/ee.mp3\" },\r\n                  { \"text\": \"ஈச்சமரம்\", \"imageUrl\": \"malaiyar/lesson4/eechamaram.jpg\", \"audioUrl\": \"malaiyar/lesson4/eechamaram.mp3\" },\r\n                  { \"text\": \"ஈசல்\", \"imageUrl\": \"malaiyar/lesson4/eesal.jpg\", \"audioUrl\": \"malaiyar/lesson4/eesal.mp3\" }\r\n                ]\r\n            }", 4, 3, 2, "உயிர் எழுத்து: 'ஈ' சொற்கள்" },
                    { 9, 1, "[\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"கறுப்பு\", \"imageUrl\": \"malaiyar/lesson5/karuppu.jpg\", \"audioUrl\": \"malaiyar/lesson5/karuppu.mp3\" },\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"சிவப்பு\", \"imageUrl\": \"malaiyar/lesson5/sivappu.jpg\", \"audioUrl\": \"malaiyar/lesson5/sivappu.mp3\" },\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"மஞ்சள்\", \"imageUrl\": \"malaiyar/lesson5/manjal.jpg\", \"audioUrl\": \"malaiyar/lesson5/manjal.mp3\" },\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"வெள்ளை\", \"imageUrl\": \"malaiyar/lesson5/vellai.jpg\", \"audioUrl\": \"malaiyar/lesson5/vellai.mp3\" },\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"நீலம்\", \"imageUrl\": \"malaiyar/lesson5/neelam.jpg\", \"audioUrl\": \"malaiyar/lesson5/neelam.mp3\" },\r\n              { \"title\": \"வண்ணங்கள்\", \"word\": \"பச்சை\", \"imageUrl\": \"malaiyar/lesson5/pachai.jpg\", \"audioUrl\": \"malaiyar/lesson5/pachai.mp3\" }\r\n            ]", 5, 3, 1, "வண்ணங்கள்: Flashcards" },
                    { 10, 2, "{\r\n                \"title\": \"'உ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"உ\",\r\n                \"items\": [\r\n                  { \"text\": \"உப்பு\", \"imageUrl\": \"malaiyar/lesson5/uppu.jpg\", \"audioUrl\": \"malaiyar/lesson5/uppu.mp3\" },\r\n                  { \"text\": \"உள்ளி\", \"imageUrl\": \"malaiyar/lesson5/ulli.jpg\", \"audioUrl\": \"malaiyar/lesson5/ulli.mp3\" },\r\n                  { \"text\": \"உடை\", \"imageUrl\": \"malaiyar/lesson5/udai.jpg\", \"audioUrl\": \"malaiyar/lesson5/udai.mp3\" },\r\n                  { \"text\": \"உலகம்\", \"imageUrl\": \"malaiyar/lesson5/ulagam.jpg\", \"audioUrl\": \"malaiyar/lesson5/ulagam.mp3\" },\r\n                  { \"text\": \"உழுந்து\", \"imageUrl\": \"malaiyar/lesson5/ulunthu.jpg\", \"audioUrl\": \"malaiyar/lesson5/ulunthu.mp3\" }\r\n                ]\r\n            }", 5, 3, 2, "உயிர் எழுத்து: 'உ' சொற்கள்" },
                    { 11, 1, "[\r\n              { \"title\": \"பூக்கள்\", \"word\": \"கார்த்திகைப்பூ\", \"imageUrl\": \"malaiyar/lesson6/karthigaipoo.jpg\", \"audioUrl\": \"malaiyar/lesson6/karthigaipoo.mp3\" },\r\n              { \"title\": \"பூக்கள்\", \"word\": \"சூரியகாந்திப்பூ\", \"imageUrl\": \"malaiyar/lesson6/suriyagandhipoo.jpg\", \"audioUrl\": \"malaiyar/lesson6/suriyagandhipoo.mp3\" },\r\n              { \"title\": \"பூக்கள்\", \"word\": \"செவ்வரத்தம்பூ\", \"imageUrl\": \"malaiyar/lesson6/sembaruthi.jpg\", \"audioUrl\": \"malaiyar/lesson6/sembaruthi.mp3\" },\r\n              { \"title\": \"பூக்கள்\", \"word\": \"தாமரைப்பூ\", \"imageUrl\": \"malaiyar/lesson6/thamarai.jpg\", \"audioUrl\": \"malaiyar/lesson6/thamarai.mp3\" },\r\n              { \"title\": \"பூக்கள்\", \"word\": \"மல்லிகைப்பூ\", \"imageUrl\": \"malaiyar/lesson6/malligai.jpg\", \"audioUrl\": \"malaiyar/lesson6/malligai.mp3\" }\r\n            ]", 6, 3, 1, "பூக்கள்: Flashcards" },
                    { 12, 2, "{\r\n                \"title\": \"'ஊ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஊ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஊஞ்சல்\", \"imageUrl\": \"malaiyar/lesson6/oonjal.jpg\", \"audioUrl\": \"malaiyar/lesson6/oonjal.mp3\" },\r\n                  { \"text\": \"ஊர்\", \"imageUrl\": \"malaiyar/lesson6/oor.jpg\", \"audioUrl\": \"malaiyar/lesson6/oor.mp3\" },\r\n                  { \"text\": \"ஊறுகாய்\", \"imageUrl\": \"malaiyar/lesson6/oorugai.jpg\", \"audioUrl\": \"malaiyar/lesson6/oorugai.mp3\" },\r\n                  { \"text\": \"ஊசி\", \"imageUrl\": \"malaiyar/lesson6/oosi.jpg\", \"audioUrl\": \"malaiyar/lesson6/oosi.mp3\" },\r\n                  { \"text\": \"ஊதல்\", \"imageUrl\": \"malaiyar/lesson6/oothal.jpg\", \"audioUrl\": \"malaiyar/lesson6/oothal.mp3\" }\r\n                ]\r\n            }", 6, 3, 2, "உயிர் எழுத்து: 'ஊ' சொற்கள்" },
                    { 13, 1, "[\r\n              { \"title\": \"பறவைகள்\", \"word\": \"காகம்\", \"imageUrl\": \"malaiyar/lesson7/kagam.jpg\", \"audioUrl\": \"malaiyar/lesson7/kagam.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"கிளி\", \"imageUrl\": \"malaiyar/lesson7/kili.jpg\", \"audioUrl\": \"malaiyar/lesson7/kili.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"குயில்\", \"imageUrl\": \"malaiyar/lesson7/kuyil.jpg\", \"audioUrl\": \"malaiyar/lesson7/kuyil.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"வாத்து\", \"imageUrl\": \"malaiyar/lesson7/vaathu.jpg\", \"audioUrl\": \"malaiyar/lesson7/vaathu.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"கோழி\", \"imageUrl\": \"malaiyar/lesson7/kozhi.jpg\", \"audioUrl\": \"malaiyar/lesson7/kozhi.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"புறா\", \"imageUrl\": \"malaiyar/lesson7/pura.jpg\", \"audioUrl\": \"malaiyar/lesson7/pura.mp3\" },\r\n              { \"title\": \"பறவைகள்\", \"word\": \"மயில்\", \"imageUrl\": \"malaiyar/lesson7/mayil.jpg\", \"audioUrl\": \"malaiyar/lesson7/mayil.mp3\" }\r\n            ]", 7, 3, 1, "பறவைகள்: Flashcards" },
                    { 14, 2, "[\r\n              {\r\n                \"title\": \"'எ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"எ\",\r\n                \"items\": [\r\n                  { \"text\": \"எலி\", \"imageUrl\": \"malaiyar/lesson7/eli.jpg\", \"audioUrl\": \"malaiyar/lesson7/eli.mp3\" },\r\n                  { \"text\": \"எறும்பு\", \"imageUrl\": \"malaiyar/lesson7/erumbu.jpg\", \"audioUrl\": \"malaiyar/lesson7/erumbu.mp3\" },\r\n                  { \"text\": \"எலும்பு\", \"imageUrl\": \"malaiyar/lesson7/elumbu.jpg\", \"audioUrl\": \"malaiyar/lesson7/elumbu.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஏ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஏ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஏடு\", \"imageUrl\": \"malaiyar/lesson7/edu.jpg\", \"audioUrl\": \"malaiyar/lesson7/edu.mp3\" },\r\n                  { \"text\": \"ஏணி\", \"imageUrl\": \"malaiyar/lesson7/eni.jpg\", \"audioUrl\": \"malaiyar/lesson7/eni.mp3\" },\r\n                  { \"text\": \"ஏரி\", \"imageUrl\": \"malaiyar/lesson7/eri.jpg\", \"audioUrl\": \"malaiyar/lesson7/eri.mp3\" }\r\n                ]\r\n              }\r\n            ]", 7, 3, 2, "உயிர் எழுத்து: 'எ', 'ஏ' சொற்கள்" },
                    { 15, 1, "[\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"ஆடு\", \"imageUrl\": \"malaiyar/lesson8/aadu.jpg\", \"audioUrl\": \"malaiyar/lesson8/aadu.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"மாடு\", \"imageUrl\": \"malaiyar/lesson8/maadu.jpg\", \"audioUrl\": \"malaiyar/lesson8/maadu.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"குதிரை\", \"imageUrl\": \"malaiyar/lesson8/kuthirai.jpg\", \"audioUrl\": \"malaiyar/lesson8/kuthirai.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"நாய்\", \"imageUrl\": \"malaiyar/lesson8/naai.jpg\", \"audioUrl\": \"malaiyar/lesson8/naai.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"பூனை\", \"imageUrl\": \"malaiyar/lesson8/poonai.jpg\", \"audioUrl\": \"malaiyar/lesson8/poonai.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"சிங்கம்\", \"imageUrl\": \"malaiyar/lesson8/singam.jpg\", \"audioUrl\": \"malaiyar/lesson8/singam.mp3\" },\r\n              { \"title\": \"விலங்குகள்\", \"word\": \"யானை\", \"imageUrl\": \"malaiyar/lesson8/yaanai.jpg\", \"audioUrl\": \"malaiyar/lesson8/yaanai.mp3\" }\r\n            ]", 8, 3, 1, "விலங்குகள்: Flashcards" },
                    { 16, 2, "{\r\n                \"title\": \"'ஐ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஐ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஐந்து\", \"imageUrl\": \"malaiyar/lesson8/ainthu.jpg\", \"audioUrl\": \"malaiyar/lesson8/ainthu.mp3\" },\r\n                  { \"text\": \"ஐம்பது\", \"imageUrl\": \"malaiyar/lesson8/aimbathu.jpg\", \"audioUrl\": \"malaiyar/lesson8/aimbathu.mp3\" },\r\n                  { \"text\": \"ஐவர்\", \"imageUrl\": \"malaiyar/lesson8/aivar.jpg\", \"audioUrl\": \"malaiyar/lesson8/aivar.mp3\" }\r\n                ]\r\n            }", 8, 3, 2, "உயிர் எழுத்து: 'ஐ' சொற்கள்" },
                    { 17, 1, "[\r\n              { \"title\": \"விளையாட்டுகள்\", \"word\": \"நீச்சல்\", \"imageUrl\": \"malaiyar/lesson9/neechal.jpg\", \"audioUrl\": \"malaiyar/lesson9/neechal.mp3\" },\r\n              { \"title\": \"விளையாட்டுகள்\", \"word\": \"காற்பந்து\", \"imageUrl\": \"malaiyar/lesson9/kaarpandhu.jpg\", \"audioUrl\": \"malaiyar/lesson9/kaarpandhu.mp3\" },\r\n              { \"title\": \"விளையாட்டுகள்\", \"word\": \"ஓட்டம்\", \"imageUrl\": \"malaiyar/lesson9/ottam.jpg\", \"audioUrl\": \"malaiyar/lesson9/ottam.mp3\" },\r\n              { \"title\": \"விளையாட்டுகள்\", \"word\": \"பட்டம்\", \"imageUrl\": \"malaiyar/lesson9/pattam.jpg\", \"audioUrl\": \"malaiyar/lesson9/pattam.mp3\" },\r\n              { \"title\": \"விளையாட்டுகள்\", \"word\": \"ஊஞ்சல்\", \"imageUrl\": \"malaiyar/lesson9/oonjal.jpg\", \"audioUrl\": \"malaiyar/lesson9/oonjal.mp3\" }\r\n            ]", 9, 3, 1, "விளையாட்டுகள்: Flashcards" },
                    { 18, 2, "[\r\n              {\r\n                \"title\": \"'ஒ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஒ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஒட்டகம்\", \"imageUrl\": \"malaiyar/lesson9/ottagam.jpg\", \"audioUrl\": \"malaiyar/lesson9/ottagam.mp3\" },\r\n                  { \"text\": \"ஒன்பது\", \"imageUrl\": \"malaiyar/lesson9/onpathu.jpg\", \"audioUrl\": \"malaiyar/lesson9/onpathu.mp3\" },\r\n                  { \"text\": \"ஒன்று\", \"imageUrl\": \"malaiyar/lesson9/ondru.jpg\", \"audioUrl\": \"malaiyar/lesson9/ondru.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஓ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஓ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஓநாய்\", \"imageUrl\": \"malaiyar/lesson9/onaai.jpg\", \"audioUrl\": \"malaiyar/lesson9/onaai.mp3\" },\r\n                  { \"text\": \"ஓணான்\", \"imageUrl\": \"malaiyar/lesson9/onaan.jpg\", \"audioUrl\": \"malaiyar/lesson9/onaan.mp3\" },\r\n                  { \"text\": \"ஓடம்\", \"imageUrl\": \"malaiyar/lesson9/odam.jpg\", \"audioUrl\": \"malaiyar/lesson9/odam.mp3\" }\r\n                ]\r\n              }\r\n            ]", 9, 3, 2, "உயிர் எழுத்து: 'ஒ', 'ஓ' சொற்கள்" },
                    { 19, 1, "[\r\n              { \"title\": \"கொண்டாட்டம்\", \"word\": \"தைப்பொங்கல்\", \"imageUrl\": \"malaiyar/lesson10/thaipongal.jpg\", \"audioUrl\": \"malaiyar/lesson10/thaipongal.mp3\" },\r\n              { \"title\": \"கொண்டாட்டம்\", \"word\": \"புத்தாண்டு\", \"imageUrl\": \"malaiyar/lesson10/puthaandu.jpg\", \"audioUrl\": \"malaiyar/lesson10/puthaandu.mp3\" },\r\n              { \"title\": \"கொண்டாட்டம்\", \"word\": \"பிறந்தநாள்\", \"imageUrl\": \"malaiyar/lesson10/piranthanaal.jpg\", \"audioUrl\": \"malaiyar/lesson10/piranthanaal.mp3\" },\r\n              { \"title\": \"கொண்டாட்டம்\", \"word\": \"திருமணம்\", \"imageUrl\": \"malaiyar/lesson10/thirumanam.jpg\", \"audioUrl\": \"malaiyar/lesson10/thirumanam.mp3\" },\r\n              { \"title\": \"கொண்டாட்டம்\", \"word\": \"திருவிழா\", \"imageUrl\": \"malaiyar/lesson10/thiruvizha.jpg\", \"audioUrl\": \"malaiyar/lesson10/thiruvizha.mp3\" }\r\n            ]", 10, 3, 1, "கொண்டாட்டம்: Flashcards" },
                    { 20, 2, "[\r\n              {\r\n                \"title\": \"'ஔ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஔ\",\r\n                \"items\": [\r\n                  { \"text\": \"ஔவையார்\", \"imageUrl\": \"malaiyar/lesson10/avvaiyar.jpg\", \"audioUrl\": \"malaiyar/lesson10/avvaiyar.mp3\" },\r\n                  { \"text\": \"ஔவைடதம்\", \"imageUrl\": \"malaiyar/lesson10/avvaidadham.jpg\", \"audioUrl\": \"malaiyar/lesson10/avvaidadham.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஃ' ஆயுத எழுத்து\", \"spotlightLetter\": \"ஃ\",\r\n                \"items\": [\r\n                  { \"text\": \"எஃகுவாள்\", \"imageUrl\": \"malaiyar/lesson10/egkuvaal.jpg\", \"audioUrl\": \"malaiyar/lesson10/egkuvaal.mp3\" }\r\n                ]\r\n              }\r\n            ]", 10, 3, 2, "உயிர் எழுத்து: 'ஔ', 'ஃ' சொற்கள்" },
                    { 22, 2, "[\r\n              {\r\n                \"title\": \"'அ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"அ\", \"items\": [\r\n                  { \"text\": \"அலைபேசி\", \"imageUrl\": \"siruvar/lesson1/alaipesi.jpg\", \"audioUrl\": \"siruvar/lesson1/alaipesi.mp3\" },\r\n                  { \"text\": \"அன்பளிப்பு\", \"imageUrl\": \"siruvar/lesson1/anbalippu.jpg\", \"audioUrl\": \"siruvar/lesson1/anbalippu.mp3\" },\r\n                  { \"text\": \"அன்னாசி\", \"imageUrl\": \"siruvar/lesson1/annasi.jpg\", \"audioUrl\": \"siruvar/lesson1/annasi.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஆ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஆ\", \"items\": [\r\n                  { \"text\": \"ஆடு\", \"imageUrl\": \"siruvar/lesson1/aadu.jpg\", \"audioUrl\": \"siruvar/lesson1/aadu.mp3\" },\r\n                  { \"text\": \"ஆசிரியர்\", \"imageUrl\": \"siruvar/lesson1/aasiriyar.jpg\", \"audioUrl\": \"siruvar/lesson1/aasiriyar.mp3\" },\r\n                  { \"text\": \"ஆறு\", \"imageUrl\": \"siruvar/lesson1/aaru.jpg\", \"audioUrl\": \"siruvar/lesson1/aaru.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'இ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"இ\", \"items\": [\r\n                  { \"text\": \"இறகு\", \"imageUrl\": \"siruvar/lesson1/iragu.jpg\", \"audioUrl\": \"siruvar/lesson1/iragu.mp3\" },\r\n                  { \"text\": \"இதயம்\", \"imageUrl\": \"siruvar/lesson1/ithayam.jpg\", \"audioUrl\": \"siruvar/lesson1/ithayam.mp3\" },\r\n                  { \"text\": \"இனிப்பு\", \"imageUrl\": \"siruvar/lesson1/inippu.jpg\", \"audioUrl\": \"siruvar/lesson1/inippu.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஈ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஈ\", \"items\": [\r\n                  { \"text\": \"ஈச்சமரம்\", \"imageUrl\": \"siruvar/lesson1/eechamaram.jpg\", \"audioUrl\": \"siruvar/lesson1/eechamaram.mp3\" },\r\n                  { \"text\": \"ஈட்டி\", \"imageUrl\": \"siruvar/lesson1/eetti.jpg\", \"audioUrl\": \"siruvar/lesson1/eetti.mp3\" },\r\n                  { \"text\": \"ஈழம்\", \"imageUrl\": \"siruvar/lesson1/eelam.jpg\", \"audioUrl\": \"siruvar/lesson1/eelam.mp3\" }\r\n                ]\r\n              }\r\n            ]", 11, 3, 2, "உயிர் எழுத்துகள்: சொற்கள்" },
                    { 24, 2, "[\r\n              {\r\n                \"title\": \"'உ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"உ\", \"items\": [\r\n                    { \"text\": \"உணவு\", \"imageUrl\": \"siruvar/lesson2/unavu.jpg\", \"audioUrl\": \"siruvar/lesson2/unavu.mp3\" },\r\n                    { \"text\": \"உப்பு\", \"imageUrl\": \"siruvar/lesson2/uppu.jpg\", \"audioUrl\": \"siruvar/lesson2/uppu.mp3\" },\r\n                    { \"text\": \"உந்துருளி\", \"imageUrl\": \"siruvar/lesson2/unthuruli.jpg\", \"audioUrl\": \"siruvar/lesson2/unthuruli.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஊ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஊ\", \"items\": [\r\n                    { \"text\": \"ஊர்\", \"imageUrl\": \"siruvar/lesson2/oor.jpg\", \"audioUrl\": \"siruvar/lesson2/oor.mp3\" },\r\n                    { \"text\": \"ஊசி\", \"imageUrl\": \"siruvar/lesson2/oosi.jpg\", \"audioUrl\": \"siruvar/lesson2/oosi.mp3\" },\r\n                    { \"text\": \"ஊஞ்சல்\", \"imageUrl\": \"siruvar/lesson2/oonjal.jpg\", \"audioUrl\": \"siruvar/lesson2/oonjal.mp3\" }\r\n                ]\r\n              }\r\n            ]", 12, 3, 2, "உயிர் எழுத்துகள்: 'உ', 'ஊ'" },
                    { 26, 2, "[\r\n              {\r\n                \"title\": \"'எ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"எ\", \"items\": [\r\n                  { \"text\": \"எலுமிச்சை\", \"imageUrl\": \"siruvar/lesson3/elumichai.jpg\", \"audioUrl\": \"siruvar/lesson3/elumichai.mp3\" },\r\n                  { \"text\": \"எருமை\", \"imageUrl\": \"siruvar/lesson3/erumai.jpg\", \"audioUrl\": \"siruvar/lesson3/erumai.mp3\" },\r\n                  { \"text\": \"எண்ணெய்\", \"imageUrl\": \"siruvar/lesson3/ennai.jpg\", \"audioUrl\": \"siruvar/lesson3/ennai.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஏ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஏ\", \"items\": [\r\n                  { \"text\": \"ஏணை\", \"imageUrl\": \"siruvar/lesson3/enai.jpg\", \"audioUrl\": \"siruvar/lesson3/enai.mp3\" },\r\n                  { \"text\": \"ஏலக்காய்\", \"imageUrl\": \"siruvar/lesson3/elakkai.jpg\", \"audioUrl\": \"siruvar/lesson3/elakkai.mp3\" },\r\n                  { \"text\": \"ஏழு\", \"imageUrl\": \"siruvar/lesson3/elu.jpg\", \"audioUrl\": \"siruvar/lesson3/elu.mp3\" }\r\n                ]\r\n              }\r\n            ]", 13, 3, 2, "உயிர் எழுத்துகள்: 'எ', 'ஏ'" },
                    { 28, 2, "[\r\n              {\r\n                \"title\": \"'ஐ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஐ\", \"items\": [\r\n                  { \"text\": \"ஐரோப்பா\", \"imageUrl\": \"siruvar/lesson4/europa.jpg\", \"audioUrl\": \"siruvar/lesson4/europa.mp3\" },\r\n                  { \"text\": \"ஐவர்\", \"imageUrl\": \"siruvar/lesson4/aivar.jpg\", \"audioUrl\": \"siruvar/lesson4/aivar.mp3\" },\r\n                  { \"text\": \"ஐவிரல்\", \"imageUrl\": \"siruvar/lesson4/aiviral.jpg\", \"audioUrl\": \"siruvar/lesson4/aiviral.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஒ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஒ\", \"items\": [\r\n                  { \"text\": \"ஒன்பது\", \"imageUrl\": \"siruvar/lesson4/onpathu.jpg\", \"audioUrl\": \"siruvar/lesson4/onpathu.mp3\" },\r\n                  { \"text\": \"ஒலிபெருக்கி\", \"imageUrl\": \"siruvar/lesson4/oliperukki.jpg\", \"audioUrl\": \"siruvar/lesson4/oliperukki.mp3\" },\r\n                  { \"text\": \"ஒட்டகச்சிவிங்கி\", \"imageUrl\": \"siruvar/lesson4/ottagachivingi.jpg\", \"audioUrl\": \"siruvar/lesson4/ottagachivingi.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஓ' இல் தொடங்கும் சொற்கள்\", \"spotlightLetter\": \"ஓ\", \"items\": [\r\n                  { \"text\": \"ஓநாய்\", \"imageUrl\": \"siruvar/lesson4/onaai.jpg\", \"audioUrl\": \"siruvar/lesson4/onaai.mp3\" },\r\n                  { \"text\": \"ஓவியர்\", \"imageUrl\": \"siruvar/lesson4/oviyar.jpg\", \"audioUrl\": \"siruvar/lesson4/oviyar.mp3\" },\r\n                  { \"text\": \"ஓடை\", \"imageUrl\": \"siruvar/lesson4/odai.jpg\", \"audioUrl\": \"siruvar/lesson4/odai.mp3\" }\r\n                ]\r\n              }\r\n            ]", 14, 3, 2, "உயிர் எழுத்துகள்: 'ஐ', 'ஒ', 'ஓ'" },
                    { 30, 2, "[\r\n              {\r\n                \"title\": \"'க்' சொற்கள்\", \"spotlightLetter\": \"க்\", \"items\": [\r\n                  { \"text\": \"கொக்கு\", \"imageUrl\": \"siruvar/lesson5/kokku.jpg\", \"audioUrl\": \"siruvar/lesson5/kokku.mp3\" },\r\n                  { \"text\": \"பாக்கு\", \"imageUrl\": \"siruvar/lesson5/paakku.jpg\", \"audioUrl\": \"siruvar/lesson5/paakku.mp3\" },\r\n                  { \"text\": \"தக்காளி\", \"imageUrl\": \"siruvar/lesson5/thakkali.jpg\", \"audioUrl\": \"siruvar/lesson5/thakkali.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ங்' சொற்கள்\", \"spotlightLetter\": \"ங்\", \"items\": [\r\n                  { \"text\": \"சங்கு\", \"imageUrl\": \"siruvar/lesson5/sangu.jpg\", \"audioUrl\": \"siruvar/lesson5/sangu.mp3\" },\r\n                  { \"text\": \"குரங்கு\", \"imageUrl\": \"siruvar/lesson5/kurangu.jpg\", \"audioUrl\": \"siruvar/lesson5/kurangu.mp3\" },\r\n                  { \"text\": \"தங்கம்\", \"imageUrl\": \"siruvar/lesson5/thangam.jpg\", \"audioUrl\": \"siruvar/lesson5/thangam.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ச்' சொற்கள்\", \"spotlightLetter\": \"ச்\", \"items\": [\r\n                  { \"text\": \"பச்சை\", \"imageUrl\": \"siruvar/lesson5/pachai.jpg\", \"audioUrl\": \"siruvar/lesson5/pachai.mp3\" },\r\n                  { \"text\": \"எலுமிச்சை\", \"imageUrl\": \"siruvar/lesson5/elumichai.jpg\", \"audioUrl\": \"siruvar/lesson5/elumichai.mp3\" },\r\n                  { \"text\": \"நீச்சல்\", \"imageUrl\": \"siruvar/lesson5/neechal.jpg\", \"audioUrl\": \"siruvar/lesson5/neechal.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ஞ்' சொற்கள்\", \"spotlightLetter\": \"ஞ்\", \"items\": [\r\n                  { \"text\": \"இஞ்சி\", \"imageUrl\": \"siruvar/lesson5/inji.jpg\", \"audioUrl\": \"siruvar/lesson5/inji.mp3\" },\r\n                  { \"text\": \"ஊஞ்சல்\", \"imageUrl\": \"siruvar/lesson5/oonjal.jpg\", \"audioUrl\": \"siruvar/lesson5/oonjal.mp3\" },\r\n                  { \"text\": \"மஞ்சள்\", \"imageUrl\": \"siruvar/lesson5/manjal.jpg\", \"audioUrl\": \"siruvar/lesson5/manjal.mp3\" }\r\n                ]\r\n              }\r\n            ]", 15, 3, 2, "மெய்யெழுத்துகள்: க், ங், ச், ஞ்" },
                    { 32, 2, "[\r\n              {\r\n                \"title\": \"'ட்' சொற்கள்\", \"spotlightLetter\": \"ட்\", \"items\": [\r\n                  { \"text\": \"பட்டம்\", \"imageUrl\": \"siruvar/lesson6/pattam.jpg\", \"audioUrl\": \"siruvar/lesson6/pattam.mp3\" },\r\n                  { \"text\": \"பெட்டி\", \"imageUrl\": \"siruvar/lesson6/petti.jpg\", \"audioUrl\": \"siruvar/lesson6/petti.mp3\" },\r\n                  { \"text\": \"வட்டம்\", \"imageUrl\": \"siruvar/lesson6/vattam.jpg\", \"audioUrl\": \"siruvar/lesson6/vattam.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ண்' சொற்கள்\", \"spotlightLetter\": \"ண்\", \"items\": [\r\n                  { \"text\": \"நண்டு\", \"imageUrl\": \"siruvar/lesson6/nandu.jpg\", \"audioUrl\": \"siruvar/lesson6/nandu.mp3\" },\r\n                  { \"text\": \"வண்டு\", \"imageUrl\": \"siruvar/lesson6/vandu.jpg\", \"audioUrl\": \"siruvar/lesson6/vandu.mp3\" },\r\n                  { \"text\": \"மண்\", \"imageUrl\": \"siruvar/lesson6/mann.jpg\", \"audioUrl\": \"siruvar/lesson6/mann.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'த்' சொற்கள்\", \"spotlightLetter\": \"த்\", \"items\": [\r\n                  { \"text\": \"பத்து\", \"imageUrl\": \"siruvar/lesson6/pathu.jpg\", \"audioUrl\": \"siruvar/lesson6/pathu.mp3\" },\r\n                  { \"text\": \"வாத்து\", \"imageUrl\": \"siruvar/lesson6/vaathu.jpg\", \"audioUrl\": \"siruvar/lesson6/vaathu.mp3\" },\r\n                  { \"text\": \"நத்தை\", \"imageUrl\": \"siruvar/lesson6/nathai.jpg\", \"audioUrl\": \"siruvar/lesson6/nathai.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ந்' சொற்கள்\", \"spotlightLetter\": \"ந்\", \"items\": [\r\n                  { \"text\": \"பந்து\", \"imageUrl\": \"siruvar/lesson6/panthu.jpg\", \"audioUrl\": \"siruvar/lesson6/panthu.mp3\" },\r\n                  { \"text\": \"ஆந்தை\", \"imageUrl\": \"siruvar/lesson6/aanthai.jpg\", \"audioUrl\": \"siruvar/lesson6/aanthai.mp3\" },\r\n                  { \"text\": \"தந்தம்\", \"imageUrl\": \"siruvar/lesson6/thantham.jpg\", \"audioUrl\": \"siruvar/lesson6/thantham.mp3\" }\r\n                ]\r\n              }\r\n            ]", 16, 3, 2, "மெய்யெழுத்துகள்: ட், ண், த், ந்" },
                    { 34, 2, "[\r\n              {\r\n                \"title\": \"'ப்' சொற்கள்\", \"spotlightLetter\": \"ப்\", \"items\": [\r\n                  { \"text\": \"சீப்பு\", \"imageUrl\": \"siruvar/lesson7/seeppu.jpg\", \"audioUrl\": \"siruvar/lesson7/seeppu.mp3\" },\r\n                  { \"text\": \"பப்பாசி\", \"imageUrl\": \"siruvar/lesson7/pappasi.jpg\", \"audioUrl\": \"siruvar/lesson7/pappasi.mp3\" },\r\n                  { \"text\": \"கப்பல்\", \"imageUrl\": \"siruvar/lesson7/kappal.jpg\", \"audioUrl\": \"siruvar/lesson7/kappal.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ம்' சொற்கள்\", \"spotlightLetter\": \"ம்\", \"items\": [\r\n                  { \"text\": \"மரம்\", \"imageUrl\": \"siruvar/lesson7/maram.jpg\", \"audioUrl\": \"siruvar/lesson7/maram.mp3\" },\r\n                  { \"text\": \"மாம்பழம்\", \"imageUrl\": \"siruvar/lesson7/maampazham.jpg\", \"audioUrl\": \"siruvar/lesson7/maampazham.mp3\" },\r\n                  { \"text\": \"பாம்பு\", \"imageUrl\": \"siruvar/lesson7/paambu.jpg\", \"audioUrl\": \"siruvar/lesson7/paambu.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ய்' சொற்கள்\", \"spotlightLetter\": \"ய்\", \"items\": [\r\n                  { \"text\": \"நாய்\", \"imageUrl\": \"siruvar/lesson7/naai.jpg\", \"audioUrl\": \"siruvar/lesson7/naai.mp3\" },\r\n                  { \"text\": \"தாய்\", \"imageUrl\": \"siruvar/lesson7/thaai.jpg\", \"audioUrl\": \"siruvar/lesson7/thaai.mp3\" },\r\n                  { \"text\": \"மாங்காய்\", \"imageUrl\": \"siruvar/lesson7/maangaai.jpg\", \"audioUrl\": \"siruvar/lesson7/maangaai.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ர்' சொற்கள்\", \"spotlightLetter\": \"ர்\", \"items\": [\r\n                  { \"text\": \"ஏர்\", \"imageUrl\": \"siruvar/lesson7/aer.jpg\", \"audioUrl\": \"siruvar/lesson7/aer.mp3\" },\r\n                  { \"text\": \"வேர்\", \"imageUrl\": \"siruvar/lesson7/vaer.jpg\", \"audioUrl\": \"siruvar/lesson7/vaer.mp3\" },\r\n                  { \"text\": \"ஆசிரியர்\", \"imageUrl\": \"siruvar/lesson7/aasiriyar.jpg\", \"audioUrl\": \"siruvar/lesson7/aasiriyar.mp3\" }\r\n                ]\r\n              }\r\n            ]", 17, 3, 2, "மெய்யெழுத்துகள்: ப், ம், ய், ர்" },
                    { 36, 2, "[\r\n              {\r\n                \"title\": \"'ல்' சொற்கள்\", \"spotlightLetter\": \"ல்\", \"items\": [\r\n                  { \"text\": \"மயில்\", \"imageUrl\": \"siruvar/lesson8/mayil.jpg\", \"audioUrl\": \"siruvar/lesson8/mayil.mp3\" },\r\n                  { \"text\": \"சேவல்\", \"imageUrl\": \"siruvar/lesson8/seval.jpg\", \"audioUrl\": \"siruvar/lesson8/seval.mp3\" },\r\n                  { \"text\": \"கால்\", \"imageUrl\": \"siruvar/lesson8/kaal.jpg\", \"audioUrl\": \"siruvar/lesson8/kaal.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'வ்' சொற்கள்\", \"spotlightLetter\": \"வ்\", \"items\": [\r\n                  { \"text\": \"செவ்வாழை\", \"imageUrl\": \"siruvar/lesson8/sevvalai.jpg\", \"audioUrl\": \"siruvar/lesson8/sevvalai.mp3\" },\r\n                  { \"text\": \"செவ்வகம்\", \"imageUrl\": \"siruvar/lesson8/sevvagam.jpg\", \"audioUrl\": \"siruvar/lesson8/sevvagam.mp3\" },\r\n                  { \"text\": \"செவ்வந்தி\", \"imageUrl\": \"siruvar/lesson8/sevvanthi.jpg\", \"audioUrl\": \"siruvar/lesson8/sevvanthi.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ழ்' சொற்கள்\", \"spotlightLetter\": \"ழ்\", \"items\": [\r\n                  { \"text\": \"தாழ்ப்பாழ்\", \"imageUrl\": \"siruvar/lesson8/thaalpaal.jpg\", \"audioUrl\": \"siruvar/lesson8/thaalpaal.mp3\" },\r\n                  { \"text\": \"யாழ்\", \"imageUrl\": \"siruvar/lesson8/yaal.jpg\", \"audioUrl\": \"siruvar/lesson8/yaal.mp3\" },\r\n                  { \"text\": \"தமிழ்\", \"imageUrl\": \"siruvar/lesson8/tamil.jpg\", \"audioUrl\": \"siruvar/lesson8/tamil.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ள்' சொற்கள்\", \"spotlightLetter\": \"ள்\", \"items\": [\r\n                  { \"text\": \"வாள்\", \"imageUrl\": \"siruvar/lesson8/vaal.jpg\", \"audioUrl\": \"siruvar/lesson8/vaal.mp3\" },\r\n                  { \"text\": \"தேள்\", \"imageUrl\": \"siruvar/lesson8/thel.jpg\", \"audioUrl\": \"siruvar/lesson8/thel.mp3\" },\r\n                  { \"text\": \"பள்ளி\", \"imageUrl\": \"siruvar/lesson8/palli.jpg\", \"audioUrl\": \"siruvar/lesson8/palli.mp3\" }\r\n                ]\r\n              }\r\n            ]", 18, 3, 2, "மெய்யெழுத்துகள்: ல், வ், ழ், ள்" },
                    { 38, 2, "[\r\n              {\r\n                \"title\": \"'ற்' சொற்கள்\", \"spotlightLetter\": \"ற்\", \"items\": [\r\n                  { \"text\": \"பாகற்காய்\", \"imageUrl\": \"siruvar/lesson9/pagarkai.jpg\", \"audioUrl\": \"siruvar/lesson9/pagarkai.mp3\" },\r\n                  { \"text\": \"காற்றாடி\", \"imageUrl\": \"siruvar/lesson9/kaatradi.jpg\", \"audioUrl\": \"siruvar/lesson9/kaatradi.mp3\" },\r\n                  { \"text\": \"நெற்றி\", \"imageUrl\": \"siruvar/lesson9/netri.jpg\", \"audioUrl\": \"siruvar/lesson9/netri.mp3\" }\r\n                ]\r\n              },\r\n              {\r\n                \"title\": \"'ன்' சொற்கள்\", \"spotlightLetter\": \"ன்\", \"items\": [\r\n                  { \"text\": \"மீன்\", \"imageUrl\": \"siruvar/lesson9/meen.jpg\", \"audioUrl\": \"siruvar/lesson9/meen.mp3\" },\r\n                  { \"text\": \"காளான்\", \"imageUrl\": \"siruvar/lesson9/kaalaan.jpg\", \"audioUrl\": \"siruvar/lesson9/kaalaan.mp3\" },\r\n                  { \"text\": \"மூன்று\", \"imageUrl\": \"siruvar/lesson9/moondru.jpg\", \"audioUrl\": \"siruvar/lesson9/moondru.mp3\" }\r\n                ]\r\n              }\r\n            ]", 19, 3, 2, "மெய்யெழுத்துகள்: ற், ன்" },
                    { 40, 2, "{\r\n                \"title\": \"எழுத்துகள் மீள்பார்வை\", \"spotlightLetter\": \"அ\", \"items\": [\r\n                  { \"text\": \"அம்மா\", \"imageUrl\": \"siruvar/lesson10/amma.jpg\", \"audioUrl\": \"siruvar/lesson10/amma.mp3\" },\r\n                  { \"text\": \"ஆடு\", \"imageUrl\": \"siruvar/lesson10/aadu.jpg\", \"audioUrl\": \"siruvar/lesson10/aadu.mp3\" },\r\n                  { \"text\": \"இலை\", \"imageUrl\": \"siruvar/lesson10/ilai.jpg\", \"audioUrl\": \"siruvar/lesson10/ilai.mp3\" },\r\n                  { \"text\": \"ஈட்டி\", \"imageUrl\": \"siruvar/lesson10/eetti.jpg\", \"audioUrl\": \"siruvar/lesson10/eetti.mp3\" },\r\n                  { \"text\": \"உரல்\", \"imageUrl\": \"siruvar/lesson10/ural.jpg\", \"audioUrl\": \"siruvar/lesson10/ural.mp3\" },\r\n                  { \"text\": \"ஊஞ்சல்\", \"imageUrl\": \"siruvar/lesson10/oonjal.jpg\", \"audioUrl\": \"siruvar/lesson10/oonjal.mp3\" }\r\n                ]\r\n            }", 20, 3, 2, "எழுத்துகள் பயிற்சி" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProgresses_LessonId",
                table: "UserProgresses",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProgresses_LevelId",
                table: "UserProgresses",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProgresses_MainActivityId",
                table: "UserProgresses",
                column: "MainActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_Levels_Barcode",
                table: "Levels",
                column: "Barcode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Levels_SequenceOrder",
                table: "Levels",
                column: "SequenceOrder",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_LevelId_SequenceOrder",
                table: "Lessons",
                columns: new[] { "LevelId", "SequenceOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_Slug",
                table: "Lessons",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_LessonId_SequenceOrder",
                table: "Activities",
                columns: new[] { "LessonId", "SequenceOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserCurrentProgress_CurrentLessonId",
                table: "UserCurrentProgress",
                column: "CurrentLessonId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCurrentProgress_LessonId",
                table: "UserCurrentProgress",
                column: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_ActivityTypes_ActivityTypeId",
                table: "Activities",
                column: "ActivityTypeId",
                principalTable: "ActivityTypes",
                principalColumn: "ActivityTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCurrentProgress_Lessons_CurrentLessonId",
                table: "UserCurrentProgress",
                column: "CurrentLessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCurrentProgress_Lessons_LessonId",
                table: "UserCurrentProgress",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCurrentProgress_Users_UserId",
                table: "UserCurrentProgress",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProgresses_Lessons_LessonId",
                table: "UserProgresses",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProgresses_Levels_LevelId",
                table: "UserProgresses",
                column: "LevelId",
                principalTable: "Levels",
                principalColumn: "LevelId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProgresses_MainActivities_MainActivityId",
                table: "UserProgresses",
                column: "MainActivityId",
                principalTable: "MainActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_ActivityTypes_ActivityTypeId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCurrentProgress_Lessons_CurrentLessonId",
                table: "UserCurrentProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCurrentProgress_Lessons_LessonId",
                table: "UserCurrentProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCurrentProgress_Users_UserId",
                table: "UserCurrentProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProgresses_Lessons_LessonId",
                table: "UserProgresses");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProgresses_Levels_LevelId",
                table: "UserProgresses");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProgresses_MainActivities_MainActivityId",
                table: "UserProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserProgresses",
                table: "UserProgresses");

            migrationBuilder.DropIndex(
                name: "IX_UserProgresses_LessonId",
                table: "UserProgresses");

            migrationBuilder.DropIndex(
                name: "IX_UserProgresses_LevelId",
                table: "UserProgresses");

            migrationBuilder.DropIndex(
                name: "IX_UserProgresses_MainActivityId",
                table: "UserProgresses");

            migrationBuilder.DropIndex(
                name: "IX_Levels_Barcode",
                table: "Levels");

            migrationBuilder.DropIndex(
                name: "IX_Levels_SequenceOrder",
                table: "Levels");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_LevelId_SequenceOrder",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_Slug",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Activities_LessonId_SequenceOrder",
                table: "Activities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserCurrentProgress",
                table: "UserCurrentProgress");

            migrationBuilder.DropIndex(
                name: "IX_UserCurrentProgress_CurrentLessonId",
                table: "UserCurrentProgress");

            migrationBuilder.DropIndex(
                name: "IX_UserCurrentProgress_LessonId",
                table: "UserCurrentProgress");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ActivityId",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "ActivityTypes",
                keyColumn: "ActivityTypeId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ActivityTypes",
                keyColumn: "ActivityTypeId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 51);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 52);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 53);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 54);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 55);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 56);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 57);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 58);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 59);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 60);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 61);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 62);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 63);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 64);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 65);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 66);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 67);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 68);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 69);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 70);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 71);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 72);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 73);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 74);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 75);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 76);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 77);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 78);

            migrationBuilder.DeleteData(
                table: "MainActivities",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "MainActivities",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "MainActivities",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ActivityTypes",
                keyColumn: "ActivityTypeId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ActivityTypes",
                keyColumn: "ActivityTypeId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Lessons",
                keyColumn: "LessonId",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "MainActivities",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "UserProgressId",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "Attempts",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "LearningStage",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "LevelId",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "MainActivityId",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "ProgressData",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "UserProgresses");

            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "Levels");

            migrationBuilder.DropColumn(
                name: "LessonImageUrl",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ActivityTypes");

            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "UserCurrentProgress");

            // Check if table exists before renaming
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS UserCurrentProgresses AS 
                SELECT * FROM UserCurrentProgress WHERE 1=0;
                DROP TABLE IF EXISTS UserCurrentProgress;
            ");

            migrationBuilder.RenameColumn(
                name: "MaxScore",
                table: "UserProgresses",
                newName: "ProgressId");

            migrationBuilder.RenameColumn(
                name: "LastActivityAt",
                table: "UserCurrentProgresses",
                newName: "LastUpdated");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "UserProgresses",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProgressId",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Levels",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Levels",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Lessons",
                type: "TEXT",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "ActivityName",
                table: "ActivityTypes",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CurrentLevelId",
                table: "UserCurrentProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserProgresses",
                table: "UserProgresses",
                column: "ProgressId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserCurrentProgresses",
                table: "UserCurrentProgresses",
                column: "UserId");

            // Create index only if it doesn't exist
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS IX_Lessons_LevelId ON Lessons(LevelId);");

            // Create index only if it doesn't exist
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS IX_Activities_LessonId ON Activities(LessonId);");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_ActivityTypes_ActivityTypeId",
                table: "Activities",
                column: "ActivityTypeId",
                principalTable: "ActivityTypes",
                principalColumn: "ActivityTypeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCurrentProgresses_Users_UserId",
                table: "UserCurrentProgresses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
