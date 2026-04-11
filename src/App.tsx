import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";

// Import all 8 static pages
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OwnerDashboard from "@/pages/OwnerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Favorites from "@/pages/Favorites";
import AddPropertyPage from "./pages/AddPropertyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property-details" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;