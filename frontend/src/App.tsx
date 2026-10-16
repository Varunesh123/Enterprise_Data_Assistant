import './App.css'
import { BrowserRouter,Routes,Route,Navigate  } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Catalog from './pages/Catalog'
import Schemas from './pages/Schemas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/catalog" element={<Catalog />}/>
          <Route path='/catalogs/:catalogId/schemas' element={<Schemas/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

