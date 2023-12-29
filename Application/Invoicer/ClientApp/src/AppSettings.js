const SETTINGS = {
    //regular expressions
    PHONE_REG_EXPRESSION: /phone/g,
    EMAIL_REG_EXPRESSION: /email/g,
    //uris
    GET_TRANSACTIONS_URI: "/api/transactions/",
    GET_COMPANIES_URI: "/api/companies",
    TRANSACTIONS_URI: "/transactions",
    REMAININGBALANCE_URL: "/remaining-balance",
    ADD_COMPANY_URI: "/add-company",
    //query parameters
    TRANSACTION_TYPE_CHOICES: ["invoice", "payment"],
    TYPE_QUERY_PARAMETER: "type",
    NEW_QUERY_PARAMETER: "new",
    COMPANY_ID_QUERY_PARAMETER: "companyID",
    ID_QUERY_PARAMETER: "id"
};

export default SETTINGS;