using Backend.Services;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<DataService>();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var app = builder.Build();
app.UseCors("AllowFrontend");

var data = app.Services.GetRequiredService<DataService>();
Console.WriteLine($"Haastattelut: {data.Haastattelut.Count}");
Console.WriteLine($"Tutkinnot: {data.Tutkinnot.Count}");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.MapGet("/", () => "Ok");
app.Run();
