import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function VerifyEmail({ status }) {
  return (
    <AuthenticatedLayout>
      <Head title="Verify Email" />
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-600">
          Before proceeding, please check your email for a verification link. If you did not receive the email, request another.
        </p>

        {status === 'verification-link-sent' && (
          <div className="mt-4 text-sm text-green-600">
            A new verification link has been sent to your email address.
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <Link
            href={route('verification.send')}
            method="post"
            as="button"
            className="px-4 py-2 bg-[#37692F] text-white rounded"
          >
            Resend verification email
          </Link>

          <Link
            href={route('profile.edit')}
            className="px-4 py-2 border rounded"
          >
            Back to profile
          </Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}