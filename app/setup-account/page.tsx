import { Suspense } from "react";
import SetupAccountClient from "./SetupAccountClient";

export default function SetupAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fcfe] p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-500">Invalid Link</h2>
          <p className="mt-2 text-[#002454]/70">No invitation token provided. Please check your email link.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/user/setupAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(data.role === "candidate" ? "/" : "/admin/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to setup account");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fcfe] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#002454]/10 bg-white p-8 text-center shadow-[0_2rem_5rem_rgba(0,36,84,0.05)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-[#002454]">Email Verified!</h2>
          <p className="mt-2 text-[#002454]/70">Your account is ready. Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <SetupAccountClient />
    </Suspense>
  );
}
