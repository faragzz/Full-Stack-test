import { Routes, Route, Outlet } from "react-router-dom";

import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home/Home";
import { Signin } from "./pages/Signin/Signin";
import { Signup } from "./pages/Signup/Signup";

import "./index.css";

const Layout = () => {
  return (
    <div className="min-h-screen">
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
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
