import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import ProtectedRoute from './components/Protectedroute.jsx'


function App() {

  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
    </>
  )
}

export default App
