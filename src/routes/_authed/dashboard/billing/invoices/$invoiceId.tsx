import { createFileRoute } from "@tanstack/react-router";
import InvoiceDetailsView from "@/feature/billing/ui/views/InvoiceDetailsView";

export const Route = createFileRoute("/_authed/dashboard/billing/invoices/$invoiceId")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Invoice Details",
	},
});

function RouteComponent() {
	return <InvoiceDetailsView />;
}
