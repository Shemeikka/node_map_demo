using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapDemo.Models
{
    public interface INodeRepository
    {
        void Add(NodeItem item);
        IEnumerable<NodeItem> GetAll();
        NodeItem Find(string key);
        NodeItem Remove(string key);
        void Update(NodeItem item);
        void Randomize();
    }
}
