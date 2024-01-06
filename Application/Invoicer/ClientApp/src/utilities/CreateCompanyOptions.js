export default function createCompanyOptions(companies) {
    let options = [];
    for (let i = 0; i < companies.length; i++) {
        const CurrentCompany = companies[i];
        options.push(<option key={CurrentCompany.id} value={CurrentCompany.id}>{CurrentCompany.name}</option>);
    }
    return options;
}