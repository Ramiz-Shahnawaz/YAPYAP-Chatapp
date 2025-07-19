import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'


function App() {

  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        {/* <Route path='/chat' element={<Chat/>}/> */}
      </Routes>
      <Chat/>
    </div>
    </>
  )
}

export default App
