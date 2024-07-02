
import { Metadata } from "next";
import { Card } from 'primereact/card';
import MakeRecipe from "@/app/ui/production-planning/make-recipe";

export const metadata: Metadata = {
  title: "Production-Planning",
};

export default function Page() {

  return (
    <div className="p-2 bg-primary-100">

      <Card className="mb-2 p-0 max-h-15" title={"Rencana Produksi"} />
      <MakeRecipe />

    </div>
  );
}