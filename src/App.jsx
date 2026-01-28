import './App.css'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Bangles from './Pages/Bangles'
import Bracelets from './Pages/Bracelets'
import Earrings from './Pages/Earrings'
import Necklace from './Pages/Necklace'
import Pendant from './Pages/Pendant'
import Rings from './Pages/Rings'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Cart from './Pages/Cart'
import DeliveryAddress from './Pages/NavbarPages/DeliveryAddress'
import Payment from './Pages/NavbarPages/Payment'
import Accounts from './Pages/NavbarPages/Accounts'
import Help from './Pages/NavbarPages/Help'
import MyOrders from './Pages/NavbarPages/MyOrders'
import Settings from './Pages/NavbarPages/Settings'

function App() {


  return (
    <>
    <div className='bg-linear-to-b from-black to-[#7D4E2E] min-h-screen'>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bangles" element={<Bangles />} />
      <Route path="/bracelets" element={<Bracelets />} />
      <Route path="/earrings" element={<Earrings />} />
      <Route path="/necklaces" element={<Necklace />} />
      <Route path="/pendants" element={<Pendant />} />
      <Route path="/rings" element={<Rings />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/delivery-address" element={<DeliveryAddress />} />
      <Route path="/payment-methods" element={<Payment />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/help" element={<Help />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
    <Footer />
    </div>
    </>
  )
}

export default App
