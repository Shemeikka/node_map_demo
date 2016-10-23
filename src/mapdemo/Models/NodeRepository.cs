using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace MapDemo.Models
{
    public class NodeRepository : INodeRepository
    {
        private static ConcurrentDictionary<string, NodeItem> _nodes = new ConcurrentDictionary<string, NodeItem>();        

        public NodeRepository()
        {
            Randomize();
        }

        public void Add(NodeItem item)
        {            
            _nodes[item.Address] = item;
        }

        public NodeItem Find(string address)
        {
            NodeItem item;
            _nodes.TryGetValue(address, out item);
            return item;
        }

        public IEnumerable<NodeItem> GetAll()
        {
            return _nodes.Values;
        }

        public NodeItem Remove(string address)
        {
            NodeItem item;
            _nodes.TryRemove(address, out item);
            return item;
        }

        public void Update(NodeItem item)
        {
            _nodes[item.Address] = item;
        }

        public void Randomize()
        {
            _nodes.Clear();

            Random rnd = new Random();

            int count = rnd.Next(3, 10);

            for (int i=0; i<count; i++)
            {
                string _i = i.ToString();
                string loc = (i * 10).ToString();
                // Address will overflow the 8 character limit if count is larger than 9.. I was lazy..
                Add(new NodeItem { Address = "0102030" + _i, PowerLevel = rnd.Next(0, 101), Latitude = "65.01" + loc, Longitude = "25.47" + loc });
            }
        }
    }
}
