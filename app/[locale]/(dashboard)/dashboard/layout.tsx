export default function DashboardPageLayout({
    children,
    stats,
    appointments,
    patients,
}: {
    children: React.ReactNode;
    stats: React.ReactNode;
    appointments: React.ReactNode;
    patients: React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            {stats}
            {appointments}
            {patients}
            {children}
        </div>
    );
}
