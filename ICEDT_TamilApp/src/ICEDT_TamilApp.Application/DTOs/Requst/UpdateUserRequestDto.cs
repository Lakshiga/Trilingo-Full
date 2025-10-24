using System.ComponentModel.DataAnnotations;

public class UpdateUserRequestDto
{
    [Required]
    public required string Username { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Role { get; set; }
}
