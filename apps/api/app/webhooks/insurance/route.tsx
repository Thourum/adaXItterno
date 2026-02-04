"use server";

import { database } from "@repo/database";
import { resend } from "@repo/email";
import { InvitationTemplate } from "@repo/email/templates/invitation";
import { log } from "@repo/observability/log";
import { NextResponse } from "next/server";
import { env } from "@/env";

/**
 * Insurance Sync API Endpoint
 *
 * This endpoint receives user sync data from insurance companies.
 * For demo purposes, no authentication is required.
 *
 * POST /webhooks/insurance
 *
 * Request body:
 * {
 *   newUsers: Array<{ email: string; name?: string; insuranceRef?: string }>;
 *   disabledUsers: Array<{ email: string; clerkUserId?: string; insuranceRef?: string }>;
 * }
 */

interface InsuranceSyncPayload {
  newUsers?: Array<{
    email: string;
    name?: string;
    insuranceRef?: string;
  }>;
  disabledUsers?: Array<{
    email: string;
    clerkUserId?: string;
    insuranceRef?: string;
  }>;
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const payload = (await request.json()) as InsuranceSyncPayload;

    log.info("Insurance sync webhook received", { payload });

    const results = {
      newUsers: {
        processed: 0,
        failed: 0,
        errors: [] as string[],
      },
      disabledUsers: {
        processed: 0,
        failed: 0,
        errors: [] as string[],
      },
    };

    // Process new users - create pending invitations
    if (payload.newUsers && payload.newUsers.length > 0) {
      for (const user of payload.newUsers) {
        try {
          // Check if invitation already exists
          const existing = await database.pendingInvitation.findUnique({
            where: { email: user.email },
          });

          if (existing) {
            log.info("Invitation already exists", { email: user.email });
            results.newUsers.processed++;
            continue;
          }

          // Create pending invitation
          await database.pendingInvitation.create({
            data: {
              email: user.email,
              name: user.name,
              insuranceRef: user.insuranceRef,
            },
          });

          // Send invitation email
          if (env.RESEND_TOKEN && env.RESEND_FROM) {
            try {
              const signUpUrl = `${env.NEXT_PUBLIC_APP_URL || "https://afterly.com"}/sign-up`;
              
              await resend.emails.send({
                from: env.RESEND_FROM,
                to: user.email,
                subject: "Welcome to Afterly - Let's Get Started",
                react: (
                  <InvitationTemplate
                    recipientName={user.name}
                    recipientEmail={user.email}
                    signUpUrl={signUpUrl}
                  />
                ),
              });
              
              log.info("Invitation email sent", { email: user.email });
            } catch (emailError) {
              log.error("Failed to send invitation email", { email: user.email, error: emailError });
              // Don't fail the whole operation if email fails
            }
          } else {
            log.warn("Email not configured, skipping invitation email", { email: user.email });
          }

          results.newUsers.processed++;
        } catch (error) {
          log.error("Failed to process new user", { email: user.email, error });
          results.newUsers.failed++;
          results.newUsers.errors.push(`Failed to invite ${user.email}`);
        }
      }
    }

    // Process disabled users - flag as INACTIVE
    if (payload.disabledUsers && payload.disabledUsers.length > 0) {
      for (const user of payload.disabledUsers) {
        try {
          let profile = null;

          // Find by clerkUserId first, then by email
          if (user.clerkUserId) {
            profile = await database.userProfile.findUnique({
              where: { clerkUserId: user.clerkUserId },
            });
          }

          if (!profile && user.email) {
            profile = await database.userProfile.findFirst({
              where: { email: user.email },
            });
          }

          if (!profile) {
            log.info("User not found for disabling", {
              email: user.email,
              clerkUserId: user.clerkUserId,
            });
            results.disabledUsers.failed++;
            results.disabledUsers.errors.push(
              `User not found: ${user.email || user.clerkUserId}`
            );
            continue;
          }

          // Update user status to INACTIVE
          await database.userProfile.update({
            where: { id: profile.id },
            data: { status: "INACTIVE" },
          });

          log.info("User disabled", { profileId: profile.id, email: user.email });
          results.disabledUsers.processed++;
        } catch (error) {
          log.error("Failed to disable user", { email: user.email, error });
          results.disabledUsers.failed++;
          results.disabledUsers.errors.push(`Failed to disable ${user.email}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Insurance sync processed",
      results,
    });
  } catch (error) {
    log.error("Insurance sync webhook error", { error });
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to process insurance sync",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

// Health check for the endpoint
export const GET = async (): Promise<Response> => {
  return NextResponse.json({
    ok: true,
    message: "Insurance sync webhook is active",
    endpoints: {
      POST: "Sync users from insurance company",
    },
  });
};
