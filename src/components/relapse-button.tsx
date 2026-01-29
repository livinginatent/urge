"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RelapseForm } from "@/components/relapse-form";

export function RelapseButton() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleSubmit = async (data: { trigger?: string; feeling?: string }) => {
    try {
      const response = await fetch("/api/urge/gave-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsFormOpen(false);
        router.refresh();
      } else {
        console.error("Failed to record relapse");
      }
    } catch (error) {
      console.error("Error recording relapse:", error);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        onClick={() => setIsFormOpen(true)}
      >
        I GAVE IN
      </Button>
      <RelapseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
