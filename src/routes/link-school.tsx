import { createFileRoute } from "@tanstack/react-router";
import CreateSchoolView from "@/feature/school/ui/views/CreateSchoolView";

export const Route = createFileRoute("/link-school")({
	component: CreateSchoolView,
});
