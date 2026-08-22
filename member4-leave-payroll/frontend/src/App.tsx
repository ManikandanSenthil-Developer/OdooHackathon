import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-brand-dark">
        <Navbar />
        <main className="flex-1 pb-16">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
