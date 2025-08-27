import './App.css'
import Layout from './layout'
import AppDashboard from './pages/dashboard/Dashboard'
import MyUnit from './pages/unit/Unit';
/* import Delete from './pages/Trash'; */
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
          {/* Mostrara la carpeta a la cual se hace navegacio */}
          <Route path="/unity/:folderId" element={<MyUnit />} />
          {/* <Route path="/trash" element={<Delete />} /> */}
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

export default App