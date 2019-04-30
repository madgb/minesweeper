import React from 'react'
import BoardWrapper from './components/BoardWrapper'
import './App.scss'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Minesweeper Game</h2>   
      </header>
      <BoardWrapper />
    </div>
  )
}

export default App
