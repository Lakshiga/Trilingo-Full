public class UserDto
{
    public int UserId { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }

    public bool IsEmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
}
