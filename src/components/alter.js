import {Button, Modal} from "react-bootstrap";
import React, {Component} from "react";

export default class Alter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let show = this.props.show
        return (
            <Modal show={show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Aluminium:</Modal.Title>
                </Modal.Header>
                <Modal.Body ><p variant="primary">{this.props.text}</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.props.handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

        )
    };
}