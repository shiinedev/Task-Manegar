import { Navigate, Route, Routes } from "react-router"
import Register from "./page/auth/Register"
import Login from "./page/auth/Login"
import Dashboard from "./page/dashboard/Dashboard"
import ProtectedRoute from "./components/auth/protectedRoute"
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute"
import Admin from "./page/Admin"



function App() {

  return (
   <div>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={ <ProtectedRoute children={<Dashboard />} /> } />
      <Route path="/admin" element={ <AdminProtectedRoute children={<Admin />} /> } />
      <Route path="/" element={<Navigate to="/login"  replace />} />
    </Routes>
   </div>
  )
}

export default App
