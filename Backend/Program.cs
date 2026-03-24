using Backend.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<DataService>();
builder.Services.AddControllers();


var app = builder.Build();

var data = app.Services.GetRequiredService<DataService>();
Console.WriteLine($"Haastattelut: {data.Haastattelut.Count}");
Console.WriteLine($"Tutkinnot: {data.Tutkinnot.Count}");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.MapControllers();
/*
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};
*/
app.MapGet("/", () => "Ok");

app.Run();
/*
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
*/