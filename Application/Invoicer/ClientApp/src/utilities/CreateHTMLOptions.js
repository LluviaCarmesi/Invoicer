export default function createHTMLOptions(optionsToCreate) {
    let options = [];
    for (let i = 0; i < optionsToCreate.length; i++) {
        const CurrentIteration = optionsToCreate[i];
        options.push(<option key={CurrentIteration.id} value={CurrentIteration.id}>{CurrentIteration.name}</option>);
    }
    return options;
}