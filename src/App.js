import React, { useReducer } from 'react';
import reducer, { initialState } from './reducer';
import { teams, scoreToWin, actionTypes } from './constants';
import './App.css';


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
  const { tiles, teamAscore, teamBscore } = state;
  const handleClick = id => {
    const flippedTile = tiles[id];
    if (flippedTile.color !== flippedTile.value) {
      dispatch({ type: actionTypes.FLIP, id });
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
  if (teamAscore === scoreToWin.teamA) {
    winningTeam = teams.A;
  }
  if (teamBscore === scoreToWin.teamB) {
    winningTeam = teams.B;
  }
  return (
    <>
      <div>
        {teams.A}: {teamAscore}/{scoreToWin.teamA} |
        {teams.B}: {teamBscore}/{scoreToWin.teamB}
      </div>
      <button onClick={() => dispatch({ type: actionTypes.RESET })}>Reset</button>
      <button
        onMouseDown={() => dispatch({ type: actionTypes.TOGGLE_SPY })}
        onMouseUp={() => dispatch({ type: actionTypes.TOGGLE_SPY })}
      >
        Spy Master check
      </button>
      {winningTeam && <div>{winningTeam} TEAM WINS!!!</div>}
      <div className="board">{rows}</div>
    </>
  );
};

export default App;
