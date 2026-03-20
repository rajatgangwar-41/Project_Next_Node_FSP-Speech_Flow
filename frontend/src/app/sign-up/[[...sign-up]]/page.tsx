import { SignUp } from "@clerk/nextjs";
import AuthProvider from "@/components/AuthProvider";

export default function Page() {
  return (
    <AuthProvider>
      <SignUp />
    </AuthProvider>
  );
}
