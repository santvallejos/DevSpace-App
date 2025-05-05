import './App.css'
import Layout from './layout'
import AppDashboard from './components/ResourceDashboard'
import MyUnit from './components/Unit';
import Delete from './components/Trash';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
      {/* Layaout del sidebar */}
      <Layout>
        <Routes>
          <Route path="/" element={<AppDashboard />} />
          <Route path="/unity" element={<MyUnit />} />
          <Route path="/trash" element={<Delete />} />
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

export default App