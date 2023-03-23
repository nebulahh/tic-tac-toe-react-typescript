import { ChangeEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { DRAW, GAME_STATES, PLAYER_O, PLAYER_X, SQUARE, SQUARE_SIZE, GAME_MODES } from "../boardInfo";
import { getRandomInt, switchPlayer } from "../utils";
import Board from "../Board";
import { minimax } from "../minimax";
import { ResultModal } from "./ResultModal";

const emptyGrid = new Array(SQUARE ** 2).fill(null);
const board = new Board();

export default function TicTacToe() {
  const [grid, setGrid] = useState(emptyGrid);
  const [gameState, setGameState] = useState(GAME_STATES.notStarted)
  const [nextPlayerMove, setNextPlayerMove] = useState<null | number>(null)
  const [winner, setWinner] = useState<null | string>(null);
  const [mode, setMode] = useState(GAME_MODES.medium);
  const [ismodalOpen, setIsModalOpen] = useState(false)
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
  });

  useEffect(() => {
    const gameWinner = board.getWinner(grid);

    const declareWinner = (winner: number) => {
      let announcer = "";

      switch (winner) {
        case PLAYER_X:
          announcer = 'Player X wins!';
          break;
        case PLAYER_O:
          announcer = 'Player O wins!';
          break;
        case DRAW:
        default:
          announcer = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(announcer);
      setTimeout(() => setIsModalOpen(true), 300);
    };

    if (gameWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(gameWinner);
    }
  }, [gameState, grid, nextPlayerMove])


  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(emptyGrid)
    setIsModalOpen(false)
  }


  const markGridCellAfterMove = useCallback(
    (index: number, player: number | null) => {
      if (player !== null) {
        setGrid((grid) => {
          const gridCopy = grid.concat()
          gridCopy[index] = player;
          return gridCopy
        })
      }
    }, [gameState]
  );

  const aiMove = useCallback(() => {
    const board = new Board(grid.concat());
    const emptyCells = board.getIndexesOfEmptyCell(grid);
    let index;
    
    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyCells.includes(index))
        break;

      case GAME_MODES.medium:
        const smartMove = !board.isBoardEmpty(grid) && Math.random() < 0.5;

        if (smartMove) {
          index = minimax(board, players.ai!)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyCells.includes(index));
        }
        break;
      case GAME_MODES.difficult:
      default:
        index = board.isBoardEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.ai!)[1];
    }

    if (index && !grid[index]) {
      if (players.ai !== null) {
        markGridCellAfterMove(index, players.ai);
      }
      setNextPlayerMove(players.human);
    }

  }, [markGridCellAfterMove, grid, players]);

  const whenHumanMove = (index: number) => {
    if (!grid[index] && nextPlayerMove === players.human ) {
      markGridCellAfterMove(index, players.human);
      setNextPlayerMove(players.ai);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (
      nextPlayerMove !== null &&
      nextPlayerMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      timeout = setTimeout(() => {
        aiMove();
      }, 500);
    }

    return () => timeout && clearTimeout(timeout);
  }, [nextPlayerMove, aiMove, players.ai, gameState]);
  

  const chooseYourPlayer = (option: number) => {
    setPlayers({ human: option, ai: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextPlayerMove(PLAYER_X);
  }

  const changeMode = (e: ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  }

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <Inner>
        <p>Select your difficulty</p>
        <select title="mode" onChange={changeMode} value={mode}>
          {
            Object.keys(GAME_MODES).map(key => {

              const gameMode = GAME_MODES[key]

              return (
                <option value={gameMode} key={gameMode}>
                  {key}
                </option>
              );
            })
          }
        </select>
      </Inner>
      <Inner>
      <p>Choose your player</p>
      <ButtonRow>
        <button type="button" onClick={() => chooseYourPlayer(PLAYER_X)}>X</button>
        <p>or</p>
        <button type="button" onClick={() => chooseYourPlayer(PLAYER_O)}>O</button>
      </ButtonRow>
    </Inner>
  </div>
  ) :  (
    <Container size={SQUARE}>
         {
           grid.map((value, index) => {
             const isGridCellMarked = value !== null;
  
             return (
               <Square key={index} onClick={() => whenHumanMove(index)}>
                 {isGridCellMarked && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
               </Square>
            )
           })
         }

         <ResultModal
           isOpen={ismodalOpen}
           winner={winner}
           close={() => setIsModalOpen(false)}
           startNewGame={startNewGame} />
       </Container>
  )
}

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Container = styled.div<{ size: number }>`
  display: flex;
  justify-content: center;
  width: ${({ size }) => `${size * (SQUARE_SIZE + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: 1px solid black;

  &:hover {
    cursor: pointer;
  }
`;

const Marker = styled.p`
  font-size: 68px;
`;