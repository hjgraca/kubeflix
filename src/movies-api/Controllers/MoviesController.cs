using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace movies_api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ILogger<MoviesController> _logger;
        private readonly IWebHostEnvironment _env;

        public MoviesController(ILogger<MoviesController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> Get()
        {
            // var options = new JsonSerializerOptions
            // {
            //     PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            //     WriteIndented = true
            // };

            using FileStream openStream = System.IO.File.OpenRead(Path.Combine(_env.ContentRootPath, "Data", "movies.json"));
            var movies = await JsonSerializer.DeserializeAsync<IEnumerable<Movie>>(openStream);

            _logger.LogInformation("Get movies");

            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovies(int id)
        {
            if (id == 0)
            {
                return NotFound();
            }

            _logger.LogInformation($"Get movie: {id}");

            using FileStream openStream = System.IO.File.OpenRead(Path.Combine(_env.ContentRootPath, "Data", "movieDetails.json"));
            var movies = await JsonSerializer.DeserializeAsync<IEnumerable<Movie>>(openStream);

            return Ok(movies.FirstOrDefault(x => x.Id == id));
        }
    }
}