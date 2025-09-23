import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ConfigContextValue {
	isClassConfigured: boolean;
	markClassConfigured: () => void;
	resetClassConfigured: () => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

const LOCAL_KEY = "acad_planner_class_configured";

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isClassConfigured, setIsClassConfigured] = useState<boolean>(false);

	useEffect(() => {
		const raw = localStorage.getItem(LOCAL_KEY);
		setIsClassConfigured(raw === "1");
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_KEY, isClassConfigured ? "1" : "0");
	}, [isClassConfigured]);

	const markClassConfigured = useCallback(() => setIsClassConfigured(true), []);
	const resetClassConfigured = useCallback(() => setIsClassConfigured(false), []);

	const value = useMemo<ConfigContextValue>(() => ({
		isClassConfigured,
		markClassConfigured,
		resetClassConfigured,
	}), [isClassConfigured, markClassConfigured, resetClassConfigured]);

	return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export function useConfig(): ConfigContextValue {
	const ctx = useContext(ConfigContext);
	if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
	return ctx;
}


