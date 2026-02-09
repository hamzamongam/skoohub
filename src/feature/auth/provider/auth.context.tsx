import { createContext } from "react";
import type { AuthSession } from "../contract/auth.schema";

export type AuthContextValue = {
	session?: AuthSession | null;
	handleLogout?: () => void;
};

export const AuthContext = createContext<AuthContextValue>({});
