namespace Invoicer
{
    internal static class AppSettings
    {
        //sql settings
        internal static string SQL_CONNECTION_STRING = "server=localhost;database=invoicer;uid=root;pwd=tooR;";
        internal static string USERS_TABLE = "invoicer.users";
        internal static string USERS_SELECT_COLUMNS_LOG_IN = "id, first_name, last_name, email, is_admin, is_editor, is_viewer";
        internal static string USERS_SELECT_COLUMNS_ADMIN = "id, first_name, last_name, username, email, is_admin, is_editor, is_viewer";
        internal static string INVOICE_DATA_TABLE = "invoicer.invoice_data";
        internal static string PAYMENTS_TABLE = "invoicer.payments";
        internal static string REMAINING_BALANCE_TABLE = "invoicer.remaining_balance";
        internal static string REMAINING_BALANCE_SELECT_COLUMNS = "total";
        internal static string TRANSACTIONS_TABLE = "invoicer.transactions";
        internal static string TRANSACTIONS_SELECT_COLUMNS = "id, type, created_date, due_payment_date, check_number, total";
        internal static string ORDER_BY_ID_DESC = "ORDER BY id DESC";
        internal static string COMPANIES_TABLE = "invoicer.companies";
        internal static string COMPANIES_SELECT_COLUMNS = "id, name, phone, email, address, city, country, zip, is_visible";
        internal static string EMPTY_PASSWORD = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

        //controller settings
        internal static string LIMIT_QUERY_PARAMETER = "limit";
        internal static string OFFSET_QUERY_PARAMETER = "offset";
        internal static string COMPANY_ID_QUERY_PARAMETER = "companyID";

        //transaction settings
        internal static string INVOICE_TYPE = "invoice";
        internal static string PAYMENT_TYPE = "payment";
    }
}
