import { Navigate, Route,Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import  HomePage  from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { SignUpPage } from "./pages/SignupPage"
import { SettingsPage } from "./pages/SettingsPage"
import { ProfilePage } from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
const App = () =>{
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen w-full"> 
      <Loader className="animate-spin h-6 w-6 text-blue-500" />
    </div>
    )
  }
  
  return(
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to = "/products" /> }/>
        <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to= "/" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to = "/"/> }/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to = "/login"/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:productId" element={<ProductDetailPage/>}/>
        <Route path="/admin" element={
          authUser?.role === "admin" ? <AdminDashboard/> : <Navigate to = "/" />
        }/>
      </Routes>
      
      <Toaster />

    </div>
  )
}

export default App;