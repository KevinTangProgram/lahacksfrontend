import Tutoring from './Tutoring';
import Home from './Home';
import Aaron from './Aaron';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
        <div id="navigation">
          <Link to="/"></Link>
          <Link to="/tutoring"></Link>
          <Link to="/aaron"></Link>
        </div>
        <div id="content">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/tutoring" element={<Tutoring />}/>
            <Route path="/aaron" element={<Aaron />}/>
          </Routes>
        </div>
    </Router>
  )
}

export default App;
