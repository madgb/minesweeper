import React, { Component } from 'react'
import './Cell.scss'

class Cell extends Component {
    constructor(props){
        super(props)
        this.state = {
            color: 'black'
        }
    }

    getValue() {
        const { value } = this.props;
        
        if (!value.opened) {
            return value.isFlagged ? "¶" : null;
        }
        if (value.isMine) {
            return "×";
        }
        if (value.neighbour === 0) {
            return null;
        }

        return value.neighbour;
    }
    
    render() {
        const {value, clickHandler, countMenu} = this.props
        let className =
            "cell" +
            (value.opened ? "" : " hidden") +
            (value.isMine ? " is-mine" : "") +
            (value.isFlagged ? " is-flag" : "");
    
        return (
            <div onClick={clickHandler} className={className} onContextMenu={countMenu}>
                {this.getValue()}
            </div>
        )
    }
}

export default Cell