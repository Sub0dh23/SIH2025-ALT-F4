import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utils file for this function
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

// Main Login Page Component
const LoginPage = () => {
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!role) {
			setError("Please select a role.");
			return;
		}
		const ok = await login({ role: role as any, email, password });
		if (ok) {
			navigate("/app", { replace: true });
		} else {
			setError("Invalid credentials. Check role, email, and password.");
		}
	};

	return (
		<div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
			<div className="max-w-md w-full mx-auto z-10">
				<Card className="bg-background/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center text-foreground">
							Login to Your Account
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="role">Select Your Role</Label>
								<Select onValueChange={setRole} value={role}>
									<SelectTrigger id="role" className="w-full">
										<SelectValue placeholder="Select a role..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="hod">HOD</SelectItem>
										<SelectItem value="timetable_coordinator">
											Timetable Coordinator
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							{error && (
								<p className="text-sm text-red-500">{error}</p>
							)}

							<Button type="submit" className="w-full">
								Login
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
			<BackgroundBeams />
		</div>
	);
};

// BackgroundBeams Component from Aceternity UI
export const BackgroundBeams = () => {
	const random = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;
	const colors = [
		"hsl(var(--primary))",
		"hsl(var(--secondary))",
		"hsl(var(--accent))",
	];
	const beams = Array.from({ length: 50 }).map((_, i) => ({
		x: random(0, 100),
		y: random(0, 100),
		duration: random(5, 20),
		delay: random(0, 10),
		color: colors[i % colors.length],
	}));

	return (
		<div className="absolute inset-0 w-full h-full overflow-hidden">
			{beams.map((beam, i) => (
				<motion.div
					key={i}
					initial={{ y: beam.y + "vh", x: beam.x + "vw", opacity: 0 }}
					animate={{
						opacity: [0, 1, 0],
						y: [beam.y + "vh", beam.y - 10 + "vh", beam.y - 20 + "vh"],
					}}
					transition={{
						duration: beam.duration,
						delay: beam.delay,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					style={{
						position: "absolute",
						width: "1px",
						height: "100vh",
						background: `linear-gradient(to bottom, transparent, ${beam.color}, transparent)`,
					}}
				/>
			))}
		</div>
	);
};

export default LoginPage;
