import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function AssetIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Asset Intelligence" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
} 