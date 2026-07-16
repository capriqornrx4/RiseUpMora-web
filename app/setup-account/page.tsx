import { Suspense } from "react";
import SetupAccountClient from "./SetupAccountClient";

export default function SetupAccountPage() {
  return (
    <Suspense fallback={null}>
      <SetupAccountClient />
    </Suspense>
  );
}
