using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TES_Learning_App.Application_Layer.DTOs.Activity.Requests
{
    public class CreateActivityDto
    {
        public string? Details_JSON { get; set; }
        public int StageId { get; set; }
        public int MainActivityId { get; set; }
        public int ActivityTypeId { get; set; }
    }
}
