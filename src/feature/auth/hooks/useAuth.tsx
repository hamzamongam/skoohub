import { useContext } from "react";
import { AuthContext } from "../provider/auth.context";

export const useAuth = () => {
	return useContext(AuthContext);
};
