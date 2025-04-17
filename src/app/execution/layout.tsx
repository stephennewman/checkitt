import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function ExecutionLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Execution" /> 
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
} 