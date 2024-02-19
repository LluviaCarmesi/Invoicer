export default function createHTMLOptions(optionsToCreate, otherAttributetoShow) {
    let options = [];
    for (let i = 0; i < optionsToCreate.length; i++) {
        const CurrentIteration = optionsToCreate[i];
        options.push(<option
            key={CurrentIteration.id}
            title={CurrentIteration.name}
            value={CurrentIteration.id}
        >
            {CurrentIteration.name}{!!otherAttributetoShow && !!CurrentIteration[otherAttributetoShow] ? " - " + CurrentIteration[otherAttributetoShow]: ""}
        </option>);
    }
    return options;
}