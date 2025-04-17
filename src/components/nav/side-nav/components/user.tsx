import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function User() {
  return (
    <div className="flex h-16 items-center border-b border-border px-2">
      <div className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800">
        <div className="flex items-center">
          <Image
            alt="User"
            width={36}
            height={36}
            src="https://media.licdn.com/dms/image/v2/C4D0BAQEhZlGvoUyLuQ/company-logo_100_100/company-logo_100_100/0/1662670152206?e=1750291200&v=beta&t=7yvf4K38ccJnCKdFQa2uGwRIvrqbMZy4Xu8Jqry8sQk"
            className="mr-2 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Checkit</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
        <ChevronDown size={16} />
      </div>
    </div>
  );
}
