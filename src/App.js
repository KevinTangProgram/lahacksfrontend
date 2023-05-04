import Home from './Home';
import Login from './Login';
import Test from './Test';
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
          <Link to="/login"></Link>
          <Link to="/test"></Link>
        </div>
        <div id="content">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/test" element={<Test />}/>
          </Routes>
        </div>
    </Router>
  )
}

export default App;
