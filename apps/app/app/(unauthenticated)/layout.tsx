import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import type { ReactNode } from "react";
import Image from "next/image";

const AUTH_IMAGE = "/media/Image%206%20-%20Insurance%20Partner%20Section.png";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="container relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    {/* Left panel – brand + image */}
    <div className="relative hidden min-h-dvh flex-col overflow-hidden lg:flex">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[#3D405B]/75"
        aria-hidden
      />
      <div className="relative z-20 flex flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <Image
            src="/afterly-logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="font-semibold text-xl text-white tracking-tight">
            Afterly
          </span>
        </div>
        <div className="absolute top-6 right-6">
          <ModeToggle />
        </div>
        <div className="mt-auto max-w-md">
          <p className="text-lg leading-relaxed text-white/95">
            &ldquo;Your digital legacy matters. We help you plan ahead so your
            family has clarity and access when it matters most.&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/70">
            Secure your accounts. Protect your memories.
          </p>
        </div>
      </div>
    </div>

    {/* Right panel – form */}
    <div className="flex flex-col justify-center p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
        {children}
      </div>
    </div>

    {/* Mobile: show branding bar and toggle */}
    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 lg:hidden">
      <span className="font-semibold text-sm text-foreground">Afterly</span>
      <ModeToggle />
    </div>
  </div>
);

export default AuthLayout;
