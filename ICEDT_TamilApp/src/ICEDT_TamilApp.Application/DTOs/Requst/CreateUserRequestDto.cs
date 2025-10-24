using System.ComponentModel.DataAnnotations;

public class CreateUserRequestDto
{
    [Required]
    public required string Username { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }

    [Required]
    public required string Role { get; set; } // "Admin" or "Teacher" or "Student"

    [StringLength(10)]
    public string? NativeLanguage { get; set; }

    [StringLength(10)]
    public string? TargetLanguage { get; set; }
}
