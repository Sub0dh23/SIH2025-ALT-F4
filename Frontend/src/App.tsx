import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/Login";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
	const { isAuthenticated } = useAuth();
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return children;
};

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<AuthProvider>
				<ConfigProvider>
					<BrowserRouter>
						<Routes>
							{/* Login is landing */}
							<Route path="/" element={<Navigate to="/login" replace />} />
							<Route path="/login" element={<LoginPage />} />
							{/* Protected app area */}
							<Route
								path="/app"
								element={
									<ProtectedRoute>
										<Index />
									</ProtectedRoute>
								}
							/>
							{/* Catch-all */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</ConfigProvider>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
