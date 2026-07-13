using Microsoft.AspNetCore.Mvc;
using M.KibakiHospital.Models;


public class TriageController:Controller{

    public IActionResult Index()
    {
        return View();
    }
    [HttpPost]
    public IActionResult Index(TriageModel model)

    {
        if(ModelState.IsValid)
        {
            return View(model);        }
        return View();
    }
}