import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthRegisterView } from "@/feature/auth/ui/views";

export const Route = createFileRoute("/register")({
	component: AuthRegisterView,
});
