import type { ReactNode } from "react";

type LegacyLayoutProperties = {
  readonly children: ReactNode;
};

/**
 * Legacy Layout - No Clerk authentication required
 * This layout is used for trusted contacts accessing deceased user's data
 * via magic link tokens.
 */
const LegacyLayout = ({ children }: LegacyLayoutProperties) => {
  return <>{children}</>;
};

export default LegacyLayout;
