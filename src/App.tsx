import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home.page';
import ProvederListPage from './pages/providerslist.page';

function App() {
  return (
    <PrimeReactProvider>
        <Router>
          <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/providerlist" element={<ProvederListPage />} />

          </Routes>
        </Router>
    </PrimeReactProvider>
  );
}

export default App;
