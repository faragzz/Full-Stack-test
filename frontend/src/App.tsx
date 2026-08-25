import { Routes, Route, Outlet } from "react-router-dom";

import { Header } from "./components/layout/Header";
import { LandingPage } from "./pages/Landing/Landing";
import { Signin } from "./pages/Signin/Signin";
import { Signup } from "./pages/Signup/Signup";

import "./index.css";
import { Home } from "./pages/Home/Home";
import { AuthInitializer } from "./components/auth/AuthInitializer";

const Layout = () => {
  return (
    <div className="min-h-screen">
      <AuthInitializer />
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
