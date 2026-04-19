import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import { Routes, Route, Link, NavLink } from "react-router";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
function App() {
  return (
    <>
     <Header />
     <Routes>
       <Route path="/" element={<Dashboard/>} />
       <Route path="/about" element={<h1>About</h1>} />
       <Route path="*" element={<NotFound />} />
     </Routes>
     <Footer/>
    </>
  );
}

export default App;
