import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Monitoring" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
