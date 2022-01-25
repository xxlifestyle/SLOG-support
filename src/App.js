
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";

function App() {
  return (
        <div className="container">
            <Router>
            <Routes>
            <Route exact path={'/'} element={<Main />} />
            <Route path={'/login'} element={<Login />} />
            </Routes>
            </Router>
        </div>
  );
}

export default App;
