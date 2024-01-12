const SETTINGS = {
    //regular expressions
    PHONE_REG_EXPRESSION: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    EMAIL_REG_EXPRESSION: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ig,
    //uris
    GET_TRANSACTIONS_URI: "/api/transactions/",
    GET_COMPANIES_URI: "/api/companies",
    GET_USERS_URI: "/api/users",
    TRANSACTIONS_URI: "/transactions",
    REMAINING_BALANCE_URL: "/remaining-balance",
    ADD_COMPANY_URI: "/add-company",
    ADD_USER__URI: "add-user",
    ADD_TRANSACTION: "add-transaction",
    //query parameters
    TRANSACTION_TYPE_CHOICES: {
        INVOICE: "invoice",
        PAYMENT: "payment"
    },
    INVOICE_DATA_TYPE_CHOICES: {
        FUEL: "fuel"
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