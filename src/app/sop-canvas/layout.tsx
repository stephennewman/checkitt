import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function SopCanvasLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="SOP Canvas" /> 
      {/* Use fixed viewport height for testing */}
      <main className="h-[85vh] overflow-hidden">
         {children}
      </main>
    </>
  );
} 