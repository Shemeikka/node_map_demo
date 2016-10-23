using MapDemo.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;


namespace MapDemo.Controllers
{
    [Route("api/[controller]")]
    public class NodesController : Controller
    {
        public INodeRepository NodeItems { get; set; }

        public NodesController(INodeRepository nodeItems)
        {
            NodeItems = nodeItems;
        }
                
        [HttpGet]
        public IEnumerable<NodeItem> Get()
        {
            NodeItems.Randomize();
            return NodeItems.GetAll();
        }
                
        [HttpGet("{address:length(8)}")]
        public IActionResult GetById(string address)
        {            
            var item = NodeItems.Find(address);
            if (item == null)
            {
                return NotFound(address);
            }
            return new JsonResult(item);
        }
                
        [HttpPost("{randomize}")]
        public void Randomize()
        {
            NodeItems.Randomize();
        }
    }
}
