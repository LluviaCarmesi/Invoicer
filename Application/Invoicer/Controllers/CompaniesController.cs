﻿using Invoicer.models;
using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCompanies()
        {
            return CompaniesServices.GetCompanies(string.Empty, string.Empty);
        }

        [HttpGet("{companyID}")]
        public IActionResult GetCompany(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            return CompaniesServices.GetCompany(companyID);
        }

        [Route("{companyID}/remaining-balance")]
        [HttpGet("{companyID}/remaining-balance")]
        public IActionResult GetRemainingBalance(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            return RemainingBalancesServices.GetRemainingBalance(companyID);
        }

        [Route("{companyID}/transactions")]
        [HttpGet("{companyID}/transactions")]
        public IActionResult GetCompanyTransactions(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            CommonServiceRequest limitandOffsetValidation = TransactionsServicesValidation.CheckLimitandOffsetParameters(Request);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            if (!limitandOffsetValidation.IsSuccessful)
            {
                return BadRequest(limitandOffsetValidation.Result);
            }
            return TransactionsServices.GetTransactions(Request.Query[AppSettings.LIMIT_QUERY_PARAMETER], Request.Query[AppSettings.OFFSET_QUERY_PARAMETER], companyID);
        }
        //POST Methods
        [Route("add-company")]
        [HttpPost("add-company")]
        public IActionResult AddCompany()
        {
            Task<CompaniesServiceRequest> companyValidation = CompaniesServicesValidation.CheckCompanyModel(Request);
            CompaniesServiceRequest companyValidationResult = companyValidation.Result;
            if (!companyValidationResult.IsSuccessful)
            {
                return BadRequest(companyValidationResult.Result);
            }
            return Ok(companyValidationResult.Company);
        }
    }
}