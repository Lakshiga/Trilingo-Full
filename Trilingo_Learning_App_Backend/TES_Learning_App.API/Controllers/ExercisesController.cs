using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TES_Learning_App.Application_Layer.DTOs.Exercise.Requests;
using TES_Learning_App.Application_Layer.DTOs.Exercise.Response;
using TES_Learning_App.Application_Layer.Interfaces.IServices;

namespace TES_Learning_App.API.Controllers
{
    [Authorize(Roles = "Admin,Parent")]
    public class ExercisesController : BaseApiController
    {
        private readonly IExerciseService _exerciseService;

        public ExercisesController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        // GET: api/exercises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExerciseDto>>> GetAll()
        {
            return Ok(await _exerciseService.GetAllAsync());
        }

        // GET: api/activities/{activityId}/exercises
        [HttpGet("/api/activities/{activityId}/exercises")]
        public async Task<ActionResult<IEnumerable<ExerciseDto>>> GetByActivityId(int activityId)
        {
            var exercises = await _exerciseService.GetByActivityIdAsync(activityId);
            return Ok(exercises);
        }

        // GET: api/exercises/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExerciseDto>> GetById(int id)
        {
            var exercise = await _exerciseService.GetByIdAsync(id);
            if (exercise == null) return NotFound();
            return Ok(exercise);
        }

        // POST: api/exercises
        [HttpPost]
        public async Task<ActionResult<ExerciseDto>> Create(CreateExerciseDto dto)
        {
            var newExercise = await _exerciseService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newExercise.Id }, newExercise);
        }

        // PUT: api/exercises/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateExerciseDto dto)
        {
            await _exerciseService.UpdateAsync(id, dto);
            return NoContent();
        }

        // DELETE: api/exercises/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _exerciseService.DeleteAsync(id);
            return NoContent();
        }
    }
}
