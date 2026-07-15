import { createFileRoute } from "@tanstack/react-router";
import InvoiceListView from "@/feature/billing/ui/views/InvoiceListView";

export const Route = createFileRoute("/_authed/dashboard/billing/invoices/")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Invoices",
	},
});

function RouteComponent() {
	return <InvoiceListView />;
}
