using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoicer.models
{
    public class Company
    {
        private int id = 0;
        private string name = string.Empty;
        private string phone = string.Empty;
        private string email = string.Empty;
        private string address = string.Empty;
        private string city = string.Empty;
        private string country = string.Empty;
        private string zip = string.Empty;
        private bool IsActive = true;

        public Company()
        {

        }
        public Company(string name, string phone, string email, string address, string city, string country, string zip)
        {
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.address = address;
            this.city = city;
            this.country = country;
            this.zip = zip;
        }
        public Company(int id, string name, string phone, string email, string address, string city, string country, string zip)
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
        public int ID
        {
            get
            {
                return id;
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
                return IsActive;
            }
            set
            {
                IsActive = value;
            }
        }
    }
}
