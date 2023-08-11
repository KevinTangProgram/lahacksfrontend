import Home from './Pages/Home';
import Intro from './Pages/Intro';
import Oasis from './Pages/Oasis';
import Pricing from './Pages/Pricing';
import Setup from './Pages/Setup';
import About from './Pages/About';
import Kevin from './Pages/Kevin';
import Reset from './Pages/Reset';
import './CSS/Home.css';
//
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { ContextProvider } from './utilities/context';
//
function App() {
  return (
    <ContextProvider>
      <Router>
        <div id="content">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/user/setup/:token" element={<Setup />} />
            <Route path="/user/reset/:token" element={<Reset />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/oasis/:id" element={<Oasis />} />
            <Route path="/kevin" element={<Kevin />} />
          </Routes>
        </div>
      </Router>
    </ContextProvider>
  )
}

export default App;
