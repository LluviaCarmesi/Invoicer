const SETTINGS = {
    // regular expressions
    PHONE_REG_EXPRESSION: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    EMAIL_REG_EXPRESSION: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ig,
    // uris
    TRANSACTIONS_API_URI: "/api/transactions",
    CUSTOMERS_API_URI: "/api/customers",
    COMPANIES_API_URI: "/api/companies",
    USERS_API_URI: "/api/users",
    CUSTOMERS_URI: "/customers",
    TRANSACTIONS_URI: "/transactions",
    REMAINING_BALANCE_URI: "/remaining-balance",
    ADD_COMPANY_URI: "/add-company",
    EDIT_COMPANY_URI: "/edit-company",
    ADD_CUSTOMER_URI: "/add-customer",
    EDIT_CUSTOMER_URI: "/edit-customer",
    ADD_USER__URI: "/add-user",
    EDIT_USER_URI: "/edit-user",
    ADD_TRANSACTION_URI: "/add-transaction",
    EDIT_TRANSACTION_URI: "/edit-transaction",
    // query parameters
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
        ADD_CUSTOMER: "addCustomer",
        EDIT_CUSTOMERS: "editCustomers",
        ADD_USER: "addUser",
        EDIT_USERS: "editUsers"
    },
    TYPE_QUERY_PARAMETER: "type",
    NEW_QUERY_PARAMETER: "new",
    CUSTOMER_ID_QUERY_PARAMETER: "customerID",
    ID_QUERY_PARAMETER: "id",
    // cookies
    COOKIE_KEYS: {
        ALL_COMPANIES: "allCompanies",
        ALL_CUSTOMERS: "allCustomers",
        CURRENT_COMPANY: "currentCompany",
        CURRENT_CUSTOMER: "currentCustomer",
        USERNAME: "username",
        SESSION_TOKEN: "sessionToken"
    }
};

export default SETTINGS;