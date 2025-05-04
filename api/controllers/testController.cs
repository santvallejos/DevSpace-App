using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ValuesController : ControllerBase
{
    [HttpGet]
    public ActionResult<string[]> Get()
    {
        // Retornamos datos de ejemplo
        return new string[] { "valor1", "valor2" };
    }
}
