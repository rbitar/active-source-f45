import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#252525] text-[#c7c7c7] text-[13px]">
      {/* Desktop */}
      <div className="hidden md:flex px-12 h-[99px] items-center justify-between relative">
        <p className="w-[312px]">
          © {new Date().getFullYear()} F45 Training. All rights reserved
        </p>

        <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <span>Powered by</span>
          <img
            src="https://supabase.frontend.co/storage/v1/object/public/apps/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/logo-white.svg"
            alt="Active Source Lab"
            className="h-5 w-auto ml-1"
          />
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/privacy"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            href="/terms"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col items-center gap-4 px-6 py-6 text-center">
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <img
            src="https://supabase.frontend.co/storage/v1/object/public/apps/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/logo-white.svg"
            alt="Active Source Lab"
            className="h-5 w-auto ml-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/privacy"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            href="/terms"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Terms of Service
          </Link>
        </div>
        <p>© {new Date().getFullYear()} F45 Training. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
