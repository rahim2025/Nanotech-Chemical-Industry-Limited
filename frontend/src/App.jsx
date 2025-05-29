import { Navigate, Route,Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import Footer from "./components/Footer"
import  HomePage  from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { SignUpPage } from "./pages/SignupPage"
import { ProfilePage } from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import AboutUsPage from "./pages/AboutUsPage"
import Career from "./pages/Career"
import InquiriesPage from "./pages/InquiriesPage"
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
        <Route path="/" element={<ProductsPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/about" element={<AboutUsPage/>}/>
        <Route path="/careers" element={<Career/>}/>
        <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to= "/" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to = "/"/> }/>

        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/products" element={<Navigate to= "/" />}/> {/* Redirect /products to / */}
        <Route path="/products/:productId" element={<ProductDetailPage/>}/>
        <Route path="/admin" element={
          authUser?.role === "admin" ? <AdminDashboard/> : <Navigate to = "/" />
        }/>
        <Route path="/admin/inquiries" element={
          authUser?.role === "admin" ? <InquiriesPage/> : <Navigate to = "/" />
        }/>
      </Routes>
      
      <Footer />
      
      <Toaster />

    </div>
  )
}

export default App;