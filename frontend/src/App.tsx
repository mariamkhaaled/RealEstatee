import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
// Pages
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import OwnerDashboard from "@/pages/OwnerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Favorites from "@/pages/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />

        <div className="flex-1">
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property-details" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/favorites" element={<Favorites />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;