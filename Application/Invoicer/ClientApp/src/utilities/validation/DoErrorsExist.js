export default function areThereErrors(errors) {
    let doErrorsExist = false;
    const errorKeys = Object.keys(errors);
    for (let i = 0; i < errorKeys.length; i++) {
        if (!!errors[errorKeys[i]]) {
            doErrorsExist = true;
            break;
        }
    }

    return doErrorsExist;
}