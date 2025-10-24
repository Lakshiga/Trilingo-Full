namespace ICEDT_TamilApp.Application.Common
{
    public class JwtSettings
    {
        public const string SectionName = "JwtSettings"; // To link to appsettings.json
        public string Secret { get; set; } = string.Empty;
        public int ExpiryDays { get; set; }
    }
}
