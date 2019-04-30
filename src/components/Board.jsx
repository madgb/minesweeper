import React, { Component } from 'react'
import Cell from './Cell'
import './Board.scss'

class Board extends Component {
    constructor(props){
        super(props)
        this.state = {
            boardData: null,
            gameStatus: "Loading...",
            mineCount: null,
            timer: 0
        }
    }

    componentDidMount() {
        const {height, width, mines} = this.props
        this.setState({
            boardData: this.initBoard(height, width, mines),
            gameStatus: "New Game Begin",
            mineCount: mines,
            timer: 0
        })
        this.timer()
    }
    
    startGame = (e) => {
        e.preventDefault()
        const {height, width, mines, widthChanger} = this.props
        this.setState({
            boardData: this.initBoard(height, width, mines),
            gameStatus: "New Game Begin",
            mineCount: mines
        })
        widthChanger()
        this.reset()
    }

    getMines(data) {
        let mineArray = [];

        data.map(row => { 
            return row.map(item => item.isMine ? mineArray.push(item) : null)
        })

        return mineArray;
    }
  
    getFlags(data) {
        let mineArray = []

        data.map(row => {
            return row.map(item => item.isFlagged ? mineArray.push(item) : null)
        })

        return mineArray
    }

    getHidden(data) {
        let mineArray = []

        data.map(row => {
            return row.map(item => !item.opened ? mineArray.push(item) : null)
        })

        return mineArray
    }

    getRandomNumber(d) {
        return Math.floor((Math.random() * 1000) + 1) % d
    }

    initBoard(height, width, mines) {
        let data = this.makeClearBoardArr(height, width)
        data = this.setMines(data, height, width, mines)
        data = this.nearByCell(data, height, width)
        return data
    }
    
    makeClearBoardArr(height, width) {
        let data = []

        for (let i = 0; i < height; i++) {
            data.push([])
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    opened: false,
                    isEmpty: false,
                    isFlagged: false,
                }
            }
        }
        return data
    }

    setMines(data, height, width, mines) {
        let randomXposition, randomYposition, plantedMine = 0

        while (plantedMine < mines) {
            randomXposition = this.getRandomNumber(width)
            randomYposition = this.getRandomNumber(height)
            if (!(data[randomXposition][randomYposition].isMine)) {
                data[randomXposition][randomYposition].isMine = true
                plantedMine++
            }
        }

        return data
    }

    nearByCell(data, height, width) {
        let updatedData = data

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0
                    const area = this.iterateBoard(data[i][j].x, data[i][j].y, data)
                    area.map(value => ( 
                        value.isMine ? mine++ : null 
                    ))
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true
                    }
                    updatedData[i][j].neighbour = mine
                }
            }
        }

        return (updatedData)
    }

    iterateBoard(row, col, val) {
        const { height, width } = this.props
        const stack = []

        if (row > 0) {
            stack.push(val[row - 1][col])
        }

        if (row < height - 1) {
            stack.push(val[row + 1][col])
        }

        if (col > 0) {
            stack.push(val[row][col - 1])
        }

        if (col < width - 1) {
            stack.push(val[row][col + 1])
        }

        if (row > 0 && col > 0) {
            stack.push(val[row - 1][col - 1])
        }

        if (row > 0 && col < width - 1) {
            stack.push(val[row - 1][col + 1])
        }

        if (row < height - 1 && col < width - 1) {
            stack.push(val[row + 1][col + 1])
        }

        if (row < height - 1 && col > 0) {
            stack.push(val[row + 1][col - 1])
        }

        return stack
    }

    revealBoard() {
        let updatedData = this.state.boardData
        updatedData.map((row) => {
            return row.map((item) => item.opened = true)
        })
        this.setState({
            boardData: updatedData
        })
    }

    revealEmpty(x, y, data) {
        let area = this.iterateBoard(x, y, data)
        area.map(value => {
            if (!value.isFlagged && !value.opened && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].opened = true
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data)
                }
            }
        })
        return data

    }

    cellClickHandler(x, y) {
        const { boardData } = this.state
        const { mines } = this.props

        if (boardData[x][y].opened || boardData[x][y].isFlagged) {
            return null
        }

        if (boardData[x][y].isMine) {
            this.setState({
                gameStatus: "You Lost"
            })
            this.revealBoard()
            this.stopTimer()
        }

        let updatedData = boardData
        updatedData[x][y].isFlagged = false
        updatedData[x][y].opened = true

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData)
        }

        if (this.getHidden(updatedData).length === mines) {
            this.setState({
                mineCount: 0, 
                gameStatus: "You Win"
            })
            this.revealBoard()
            this.stopTimer()
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines - this.getFlags(updatedData).length,
        })
    }

    flagAndMineCount(e, x, y) {
        e.preventDefault()
        let updatedData = this.state.boardData
        let mines = this.state.mineCount

        if (updatedData[x][y].opened) return

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false
            mines++
        } else {
            updatedData[x][y].isFlagged = true
            mines--
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData)
            const FlagArray = this.getFlags(updatedData)
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                this.setState({
                    mineCount: 0, 
                    gameStatus: "You Win"
                })
                this.revealBoard()
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
        })
    }

    renderBoard(data) {
        return data.map((row) => {
            return row.map((item) => {
                return (
                    <div key={item.x * row.length + item.y}>
                        <Cell
                            clickHandler={() => this.cellClickHandler(item.x, item.y)}
                            countMenu={(e) => this.flagAndMineCount(e, item.x, item.y)}
                            value={item}
                        />
                        {(row[row.length - 1] === item) ? <div className="clear" /> : ""}
                    </div>)
            })
        });

    }
    timeChanger = (seconds) => {
        let hour, min, sec

        hour = parseInt(seconds/3600);
        min = parseInt((seconds%3600)/60);
        sec = seconds%60;

        if (hour.toString().length === 1) hour = "0" + hour
        if (min.toString().length === 1) min = "0" + min
        if (sec.toString().length === 1) sec = "0" + sec

        return hour + ":" + min + ":" + sec
    }
    tick = () => {
        const { timer } = this.state
        this.setState({ timer : timer + 1 })
    }

    reset = () => {
        clearInterval( this.interval )
        this.timer()
    }

    stopTimer = () => {
        clearInterval( this.interval )
    }

    timer = () => {
        this.setState({ timer : 0 })
        this.interval = setInterval(this.tick,1000)
    }

    componentWillUnmount() {
        clearInterval( this.interval )
    }
  
    render() {
        const {mineCount, gameStatus, boardData, timer} = this.state
        const {setDifficulty} = this.props
        return (
            <div className="board">
                <div className={"game-info" + (gameStatus === "You Lost" ? " red" : "")}>
                    <span className="info">Mine Left: {mineCount}</span>
                    <h4 className="info">Game Status: {gameStatus}</h4>
                    <h5 className="timer">{this.timeChanger(timer)}</h5>
                    <select onChange={setDifficulty}>
                        <option value="easy">easy</option>
                        <option value="mid">mid</option>
                        <option value="hard">hard</option>
                    </select>
                    <button onClick={this.startGame}>New Game</button>
                </div>
                {
                    !boardData? <div>Loding Board...</div> : this.renderBoard(boardData)
                }
            </div>
        )
    }

}

export default Board;