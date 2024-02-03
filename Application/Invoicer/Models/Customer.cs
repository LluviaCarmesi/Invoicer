using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicer.Models
{
    public class Customer
    {
        private int id = 0;
        private string name = string.Empty;
        private string phone = string.Empty;
        private string email = string.Empty;
        private string address = string.Empty;
        private string city = string.Empty;
        private string country = string.Empty;
        private string zip = string.Empty;
        private bool isActive = true;

        public Customer()
        {

        }
        public Customer(string name, string phone, string email, string address, string city, string country, string zip)
        {
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.address = address;
            this.city = city;
            this.country = country;
            this.zip = zip;
        }
        public Customer(int id, string name, string phone, string email, string address, string city, string country, string zip)
        {
            this.id = id;
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.address = address;
            this.city = city;
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
        public string Phone
        {
            get
            {
                return phone;
            }
            set
            {
                phone = value;
            }
        }
        public string Email
        {
            get
            {
                return email;
            }
            set
            {
                email = value;
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
        public bool IsActive
        {
            get
            {
                return isActive;
            }
            set
            {
                isActive = value;
            }
        }
    }
}
