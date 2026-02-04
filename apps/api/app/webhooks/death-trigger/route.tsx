"use server";

import { database } from "@repo/database";
import { resend } from "@repo/email";
import { DeathNotificationTemplate } from "@repo/email/templates/death-notification";
import { log } from "@repo/observability/log";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { env } from "@/env";

/**
 * Death Trigger API Endpoint
 *
 * This endpoint triggers the "death" of a user, which:
 * 1. Locks their data (sets status to DECEASED)
 * 2. Generates magic link tokens for trusted contacts
 * 3. Sends notification emails to trusted contacts
 *
 * For demo purposes, no authentication is required.
 *
 * POST /webhooks/death-trigger
 *
 * Request body:
 * {
 *   email?: string;       // User's email
 *   clerkUserId?: string; // Or Clerk user ID
 *   deathDate?: string;   // ISO date string (optional, defaults to now)
 * }
 */

interface DeathTriggerPayload {
  email?: string;
  clerkUserId?: string;
  deathDate?: string;
}

function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const payload = (await request.json()) as DeathTriggerPayload;

    log.info("Death trigger webhook received", { payload });

    if (!payload.email && !payload.clerkUserId) {
      return NextResponse.json(
        {
          ok: false,
          message: "Either email or clerkUserId is required",
        },
        { status: 400 }
      );
    }

    // Find the user
    let profile = null;

    if (payload.clerkUserId) {
      profile = await database.userProfile.findUnique({
        where: { clerkUserId: payload.clerkUserId },
        include: {
          trustedContacts: true,
        },
      });
    }

    if (!profile && payload.email) {
      profile = await database.userProfile.findFirst({
        where: { email: payload.email },
        include: {
          trustedContacts: true,
        },
      });
    }

    if (!profile) {
      return NextResponse.json(
        {
          ok: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if already deceased
    if (profile.status === "DECEASED") {
      return NextResponse.json(
        {
          ok: false,
          message: "User is already marked as deceased",
        },
        { status: 400 }
      );
    }

    // Parse death date or use current time
    const deceasedAt = payload.deathDate
      ? new Date(payload.deathDate)
      : new Date();

    // Update user status to DECEASED
    await database.userProfile.update({
      where: { id: profile.id },
      data: {
        status: "DECEASED",
        deceasedAt,
      },
    });

    log.info("User marked as deceased", {
      profileId: profile.id,
      deceasedAt,
    });

    // Generate legacy access tokens for each trusted contact
    const tokensGenerated: Array<{
      contactId: string;
      contactName: string;
      contactEmail: string | null;
      role: string;
      token: string;
    }> = [];

    for (const contact of profile.trustedContacts) {
      try {
        // Check if token already exists for this contact
        const existingToken = await database.legacyAccessToken.findFirst({
          where: {
            contactId: contact.id,
            userId: profile.id,
          },
        });

        if (existingToken) {
          tokensGenerated.push({
            contactId: contact.id,
            contactName: contact.name,
            contactEmail: contact.email,
            role: contact.role,
            token: existingToken.token,
          });
          continue;
        }

        // Generate new token
        const token = generateSecureToken();

        await database.legacyAccessToken.create({
          data: {
            contactId: contact.id,
            userId: profile.id,
            token,
            // No expiration for now
          },
        });

        tokensGenerated.push({
          contactId: contact.id,
          contactName: contact.name,
          contactEmail: contact.email,
          role: contact.role,
          token,
        });

        // Send death notification email
        if (env.RESEND_TOKEN && env.RESEND_FROM && contact.email) {
          try {
            const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://afterly.com";
            const accessLink = `${baseUrl}/legacy/${token}`;

            await resend.emails.send({
              from: env.RESEND_FROM,
              to: contact.email,
              subject: `We're so sorry for the loss of ${profile.fullName}`,
              react: (
                <DeathNotificationTemplate
                  contactName={contact.name}
                  contactEmail={contact.email}
                  deceasedName={profile.fullName}
                  accessLink={accessLink}
                />
              ),
            });

            log.info("Death notification email sent", {
              contactEmail: contact.email,
              contactName: contact.name,
              deceasedUserName: profile.fullName,
            });
          } catch (emailError) {
            log.error("Failed to send death notification email", {
              contactEmail: contact.email,
              error: emailError,
            });
            // Don't fail the whole operation if email fails
          }
        } else {
          log.warn("Email not configured or contact has no email, skipping notification", {
            contactEmail: contact.email,
            hasResendToken: !!env.RESEND_TOKEN,
            hasResendFrom: !!env.RESEND_FROM,
          });
        }
      } catch (error) {
        log.error("Failed to generate token for contact", {
          contactId: contact.id,
          error,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Death trigger processed successfully",
      data: {
        userId: profile.id,
        userName: profile.fullName,
        deceasedAt: deceasedAt.toISOString(),
        trustedContactsNotified: tokensGenerated.length,
        // Include tokens in response for demo purposes
        // In production, tokens would only be sent via email
        accessTokens: tokensGenerated.map((t) => ({
          contactName: t.contactName,
          contactEmail: t.contactEmail,
          role: t.role,
          accessLink: `/legacy/${t.token}`,
        })),
      },
    });
  } catch (error) {
    log.error("Death trigger webhook error", { error });
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to process death trigger",
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
    message: "Death trigger webhook is active",
    endpoints: {
      POST: "Trigger death for a user and notify trusted contacts",
    },
  });
};
