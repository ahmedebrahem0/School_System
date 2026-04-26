// app/pending/page.tsx

// Shown when user is authenticated but has no role assigned yet
// User must wait for admin to assign a role

import { Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const PendingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900">
            Account Pending Approval
          </h1>
          <p className="text-zinc-500 text-[15px] leading-relaxed">
            Your account has been created successfully, but your role
            hasn&apos;t been assigned yet. Please contact your administrator
            to get access.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-amber-800">
                What to do next?
              </p>
              <p className="text-[13px] text-amber-700 mt-1">
                Contact your school administrator and ask them to assign
                a role to your account. Once assigned, you can log in normally.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button
              variant="outline"
              className="w-full border-zinc-300 text-zinc-700"
            >
              Back to Login
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PendingPage;