using System.Text.Json;
using Backend.Models;
 namespace Backend.Services;

 public class DataService
 {
     public List<Haastattelu> Haastattelut { get; set; }
     public List<TutkintoInfo> Tutkinnot { get; set; }

     public DataService()
     {
         var haastattelutPath = Path.Combine("Data", "haastattelut.json");
         var tutkinotPath = Path.Combine("Data", "tutkinnot.json");

         var haastattelutJson = File.ReadAllText(haastattelutPath);
         var tutkinnotJson = File.ReadAllText(tutkinotPath);

        Haastattelut = JsonSerializer.Deserialize<List<Haastattelu>>(haastattelutJson)
        ?? new List<Haastattelu>();
        Tutkinnot = JsonSerializer.Deserialize<List<TutkintoInfo>>(tutkinnotJson)
        ?? new List<TutkintoInfo>();
     }
 }  