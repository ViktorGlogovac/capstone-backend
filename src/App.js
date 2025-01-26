import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DocumentationPage from './routes/DocumentationPage';
import ProjectionsPage from './routes/ProjectionsPage';
import Navbar from './routes/Navbar';



function App() {
  return (
    <Router>

      <div className='appContainer' >
        <Navbar/>
        <Routes>
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/projections" element={<ProjectionsPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
