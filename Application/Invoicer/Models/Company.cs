namespace Invoicer.Models
{
    public class Company
    {
        private int id = 0;
        private string name = string.Empty;
        private string address = string.Empty;
        private string city = string.Empty;
        private string state = string.Empty;
        private string country = string.Empty;
        private string zip = string.Empty;

        public Company()
        {

        }
        public Company(string name, string address, string city, string state, string country, string zip)
        {
            this.name = name;
            this.address = address;
            this.city = city;
            this.state = state;
            this.country = country;
            this.zip = zip;
        }
        public Company(int id, string name, string address, string city, string state, string country, string zip)
        {
            this.id = id;
            this.name = name;
            this.address = address;
            this.city = city;
            this.state = state;
            this.country = country;
            this.zip = zip;
        }

        public int Id
        {
            get
            {
                return id;
            }
            set
            {
                id = value;
            }
        }
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }
        public string Address
        {
            get
            {
                return address;
            }
            set
            {
                address = value;
            }
        }
        public string City
        {
            get
            {
                return city;
            }
            set
            {
                city = value;
            }
        }
        public string State
        {
            get
            {
                return state;
            }
            set
            {
                state = value;
            }
        }
        public string Country
        {
            get
            {
                return country;
            }
            set
            {
                country = value;
            }
        }
        public string Zip
        {
            get
            {
                return zip;
            }
            set
            {
                zip = value;
            }
        }
    }
}
