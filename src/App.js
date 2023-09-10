import Home from './Pages/Home';
import Intro from './Pages/Intro';
import Oasis from './Pages/Oasis';
import Pricing from './Pages/Pricing';
import Setup from './Pages/Setup';
import About from './Pages/About';
import Kevin from './Pages/Kevin';
import Reset from './Pages/Reset';
import TestComponent from './testStorageManager/testComponent';
import FourOFour from './Pages/404';
import './CSS/Home.css';
import { Helmet } from 'react-helmet';
//
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { ContextProvider } from './utilities/context';
//
function App() {
  return (
    <div className="App">
      {/* Main Helmet (can be overriden in child components):  */}
      <Helmet>
        <title>Idea Oasis - A New Style of Note Taking</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Experience the future of note-taking - capture ideas one by one, and let AI weave them into beautiful, organized notes!"
        />
        <link rel="icon" href="blackpalm.png" />
        <link rel="apple-touch-icon" href="blackpalm.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="/main.css" />
      </Helmet>
      {/* Content:  */}
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
            <Route path="/oasis" element={<Navigate to="/home" replace />} />
            <Route path="/oasis/:id" element={<Oasis />} />
            <Route path="/kevin" element={<Kevin />} />
            <Route path="/test" element={<TestComponent />} />
            <Route path="*" element={<FourOFour />} />
          </Routes>
        </div>
      </Router>
    </ContextProvider>
    </div>
  )
}

export default App;
