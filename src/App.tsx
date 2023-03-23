import styled from "styled-components";
import TicTacToe from "./components/TicTacToe";

function App() {

  return (
    <Main>
      <TicTacToe />
    </Main>
  )
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export default App
