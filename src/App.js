import Home from './Pages/Home';
import Intro from './Pages/Intro';
import Oasis from './Pages/Oasis';
import Pricing from './Pages/Pricing';
import User from './Pages/User';
import About from './Pages/About';
import './CSS/Home.css';
//
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
//
function App() {
  return (
    <Router>
        <div id="navigation" className="overlay">
          <Link to="/">... | </Link>
          <Link to="/pricing">Pricing | </Link>
          <Link to="/about">About</Link>
        </div>
      <div className="mainHeader">
        <img src="/images/icons/iconLogo.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
        <div className="centerVertically">
          <h1 className="mainTitle">Idea Oasis</h1>
        </div>
      </div>
        <div id="content">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/user" element={<User />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/oasis/:id" element={<Oasis />} />
          </Routes>
        </div>
    </Router>
  )
}

export default App;
