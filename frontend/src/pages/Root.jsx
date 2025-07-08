import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { AuthProvider } from '@context/AuthContext';

function Root()  {
  return (
    <AuthProvider>
      <PageRoot/>
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className="min-h-screen w-full bg-[#C3E7FD] font-sans">
      <Navbar />
      <main className="pt-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Root;