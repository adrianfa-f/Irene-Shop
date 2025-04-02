import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicCatalog from "./pages/PublicCatalog"
import AdminPage from "./pages/AdminPage"
import Login from './componentes/Admin/Login';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<PublicCatalog/>}/>
          <Route path='/admin' element={<AdminPage />}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
    </Router>
  );
}

export default App;
