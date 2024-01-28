import React, { Component } from "react";
export default class PrintTransaction extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }

    render() {
        return (
            <div className="print-transaction-container">
            </div>
        );
    }
}