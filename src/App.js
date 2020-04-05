import React, { useReducer } from 'react';
import reducer, { initialState } from './reducer';
import './App.css';

const scoreToWin = {
  teamA: 9,
  teamB: 8
}

const Tile = ({ id, color, word, handleClick, value, spy }) => {
  const flipped = color === value;
  const spyClass = flipped ? 'spy' : value;
  return (
    <div
      className={`tile ${color} ${spy ? spyClass : ''}`}
      onClick={() => handleClick(id)}
    >
      {word}
    </div>
  );
};

const Row = ({ rowI, columns, handleClick, spy }) => {
  const tiles = columns.map((tile, i) =>
    <Tile
      key={i}
      id={rowI + i}
      color={tile.color}
      word={tile.word}
      handleClick={handleClick}
      value={tile.value}
      spy={spy}
    />
  );
  return <div className="row">{tiles}</div>;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tiles } = state;
  const handleClick = id => {
    const flippedTile = tiles[id];
    if (flippedTile.color !== flippedTile.value) {
      dispatch({ type: 'flip', id });
    }
  };
  const rowsCountAndLength = Math.sqrt(tiles.length);
  if (rowsCountAndLength !== Math.round(rowsCountAndLength)) {
    throw new Error('Invalid number of tiles');
  }
  const rows = [];
  for (let i = 0; i < tiles.length; i += rowsCountAndLength) {
    const rowData = tiles.slice(i, i + rowsCountAndLength);
    rows.push(<Row key={i} rowI={i} columns={rowData} handleClick={handleClick} spy={state.spy} />);
  }
  let winningTeam = '';
  if (state.teamAscore === scoreToWin.teamA) {
    winningTeam = 'teamA';
  }
  if (state.teamBscore === scoreToWin.teamB) {
    winningTeam = 'teamB';
  }
  return (
    <>
      <div>teamA: {state.teamAscore}/{scoreToWin.teamA} | teamB: {state.teamBscore}/{scoreToWin.teamB}</div>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button
        onMouseDown={() => dispatch({ type: 'toggleSpy' })}
        onMouseUp={() => dispatch({ type: 'toggleSpy' })}
      >
        Spy Master check
      </button>
      {winningTeam && <div>{winningTeam} TEAM WINS!!!</div>}
      <div className="board">{rows}</div>
    </>
  );
};

export default App;
