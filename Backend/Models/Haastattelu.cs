using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Haastattelu
    {
        public int id { get; set; }
        public DateTime pvm { get; set; }
        public int tutkintoId { get; set; }
        public int? peruskouluVuosi { get; set; }
        public int? ammatillinenVuosi { get; set; }
        public bool ammatillinenKesken { get; set; }
        public int? lukioVuosi { get; set; }
        public bool lukioKesken { get; set; }
        public int? korkeakouluVuosi { get; set; }
        public bool korkeakouluKesken { get; set; }
        public bool ulkomaanOpinnot { get; set; }
        public int tyokokemusVuosia { get; set; }
        public List<int>? osatOsaamista { get; set; }
        public List<int>? osatJonkinVerran { get; set; }
        public List<int>? osatEiTunnistettu { get; set; }
        public bool tunnistettuTyokokemuksella { get; set; }
        public bool tunnistettuKoulutuksella { get; set; }
        public bool tunnistettuMuulla { get; set; }
        public string? kieli { get; set; }
        public bool muuOsaaminen { get; set; }
    }
}