import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Components/pages/Home';
import Company from './Components/pages/Company';
import NewProject from './Components/pages/NewProject';
import Container from './Components/layout/Container';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import Projects from './Components/pages/Projects';
import Project from './Components/pages/Project';

function App() {
  return (
    <Router>
      <Navbar/>
      <Container customClass="min-height">
          <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/company" element={<Company />} />
              <Route path="/newproject" element={<NewProject />} />
              <Route path="/project/:id" element={<Project />} />
          </Routes>
      </Container>
      <Footer/>
    </Router>
  );
}

export default App;
