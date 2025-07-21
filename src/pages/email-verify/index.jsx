import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isMobile } from '@/utils/isMobile';

const EmailVerifySuccess = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f9f0 0%, #f2eaff 60%, #f8f9fb 100%),
radial-gradient(ellipse 60% 60% at 20% 80%, #e6f9f0 0%, #f2eaff 80%, #f8f9fb 100%)`,
      }}
    >
      {/* Brand Logo */}
      <div className="absolute top-6 left-8">
        <img
          src="/brand-logo.png"
          alt="Brand Logo"
          className="h-8 w-8 md:h-10 md:w-10 drop-shadow"
        />
      </div>

      {/* Back to Login Link */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: '#25282D' }}
        >
          <Home className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      {/* Success Card */}
      <Card
        className="w-full max-w-md mx-4 border border-gray-100"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0) -9.58%, rgba(255,255,255,0.052) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: isMobile()
            ? 'none'
            : [
                '0px 10px 10px 0px #0000001A',
                '0px 4px 4px 0px #0000000D',
                '0px 1px 0px 0px #0000000D',
                '0px 20px 50px 0px #FFFFFF26 inset',
              ].join(', '),
        }}
      >
        <CardContent className="p-10 flex flex-col items-center text-center">
          {/* Success Message */}
          <div className="mb-8">
            <h1 className="font-semibold text-[28px] leading-[36px] text-gray-dark tracking-[-0.01rem] mb-3">
              Email Verified Successfully!
            </h1>
            <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569] mb-2">
              Congratulations! Your email address has been verified.
            </p>
            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.01em] text-[#64748B]">
              You can now access all features of your account.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Link to="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-base"
                size="lg"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifySuccess;
