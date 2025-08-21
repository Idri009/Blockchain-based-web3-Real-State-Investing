import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import { LikesProvider } from "./contexts/LikesContext";
import AboutUs from "./pages/AboutUs";
import NavBar from "./components/navbar/Navbar";
import Developers from "./pages/Developers";
import Footer from "./pages/Footer";
import Join from "./pages/Join";
import Loading from "./pages/Header";
import Partners from "./pages/Partners";
import Properties from "./pages/Properties";
import Subscribe from "./pages/Subscribe";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Web3Provider>
        <LikesProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={
                <>
                  <Loading />
                  <Partners />
                  <Properties />
                  <AboutUs />
                  <Developers />
                  <Join />
                  <Subscribe />
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </LikesProvider>
      </Web3Provider>
    </>
  );
}

export default App;
