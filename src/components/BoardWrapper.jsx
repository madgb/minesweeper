import React, { Component } from 'react'
import Board from './Board'
import './BoardWrapper.scss'

class BoardWrapper extends Component {
    constructor(props){
        super(props)
        this.state = {
            height: 8,
            width: 8,
            mines: 4,
            difficulty: 'easy',
            maxWidth: 'max-400'
        }
    }

    setDifficulty = (e) => {
        const diff = e.target.value
        if(diff === "easy"){
            this.setState({
                height: 8,
                width: 8,
                mines: 5,
                difficulty: 'easy'
            })
        }
        if(diff === "mid"){
            this.setState({
                height: 12,
                width: 12,
                mines: 40,
                difficulty: 'mid'
            })
        }
        if(diff === "hard"){
            this.setState({
                height: 19,
                width: 19,
                mines: 80,
                difficulty: 'hard'
            })
        }
    }

    widthChanger = () => {
        const {difficulty} = this.state
        if(difficulty === "easy"){
            this.setState({
                maxWidth: 'max-400'
            })
        }
        if(difficulty === "mid"){
            this.setState({
                maxWidth: 'max-600'
            })
        }
        if(difficulty === "hard"){
            this.setState({
                maxWidth: 'max-900'
            })
        }
    }
  
    render() {
        const { height, width, mines, maxWidth } = this.state
        return (
            <div className={"board-wrapper " + maxWidth}>
                <Board 
                    height={height} 
                    width={width} 
                    mines={mines} 
                    setDifficulty={this.setDifficulty}
                    widthChanger={this.widthChanger}
                />
            </div>
        );
    }
}

export default BoardWrapper;