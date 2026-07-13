namespace M.KibakiHospital.Models
{
public class TriageModel{
    public int BloodPressure { get; set; }
    public int Temperature { get; set; }
    public int  PulseRate{ get; set; }
    public int  RespiratoryRate{ get; set; }
    public int  SPO2 { get; set; }
    public int  Weight { get; set; }
    public int  Height { get; set; }
    public int  RBS { get; set; }
    public string? AnyDisability { get; set; }
    public string? AgeCategory { get;set;}


}
}