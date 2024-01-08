const SETTINGS = {
    //regular expressions
    PHONE_REG_EXPRESSION: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    EMAIL_REG_EXPRESSION: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ig,
    //uris
    GET_TRANSACTIONS_URI: "/api/transactions/",
    GET_COMPANIES_URI: "/api/companies",
    TRANSACTIONS_URI: "/transactions",
    REMAININGBALANCE_URL: "/remaining-balance",
    ADD_COMPANY_URI: "/add-company",
    //query parameters
    TRANSACTION_TYPE_CHOICES: {
        INVOICE: "invoice",
        PAYMENT: "payment"
    },
    NEW_EDIT_CHOICES: {
        NEW: "new",
        EDIT: "edit"
    },
    APPLICATION_SETTINGS_MENUS: {
        ADD_COMPANY: "addCompany",
        EDIT_COMPANIES: "editCompanies",
        ADD_USER: "addUser",
        EDIT_USERS: "editUsers"
    },
    TYPE_QUERY_PARAMETER: "type",
    NEW_QUERY_PARAMETER: "new",
    COMPANY_ID_QUERY_PARAMETER: "companyID",
    ID_QUERY_PARAMETER: "id"
};

export default SETTINGS;