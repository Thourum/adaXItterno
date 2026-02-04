import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type DeathNotificationTemplateProps = {
  readonly contactName: string;
  readonly contactEmail: string;
  readonly deceasedName: string;
  readonly accessLink: string;
};

const baseUrl = "https://ada-x-itterno-web.vercel.app";

/**
 * Death Notification Email Template for Afterly
 * Sent to trusted contacts when a user passes away.
 */
export const DeathNotificationTemplate = ({
  contactName,
  contactEmail,
  deceasedName,
  accessLink,
}: DeathNotificationTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        We&apos;re so sorry for the loss of {deceasedName}
      </Preview>
      <Body className="bg-[#9a9a9a] font-sans m-0 p-0">
        <Container className="mx-auto max-w-[500px] my-8">
          <Section className="bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Header with Logo and Wave Image */}
            <Section className="relative">
              <Img
                src={`${baseUrl}/media/Afterly%20Gentle%20Waves%20Hero%20Image.png`}
                alt=""
                width="100%"
                className="block"
              />
              <div className="absolute top-4 left-4">
                <Text className="text-[#d4856a] text-xl font-bold m-0">
                  🕊️ Afterly
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-8 py-6">
              {/* Condolence Message */}
              <Text className="text-[#4a3728] text-2xl font-bold leading-tight m-0 mb-4">
                We&apos;re so sorry for the loss of {deceasedName}.
              </Text>
              <Text className="text-[#6b5344] text-sm leading-6 m-0 mb-6">
                They took the time to organize their digital life so you
                wouldn&apos;t have to during this difficult time.
              </Text>

              {/* What They Left */}
              <Text className="text-[#4a3728] text-lg font-bold m-0 mb-4">
                What {deceasedName} left for you:
              </Text>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Text className="text-[#d4856a] m-0 mr-3">💌</Text>
                  <Text className="text-[#6b5344] text-sm m-0">
                    Personal messages and letters
                  </Text>
                </div>
                <div className="flex items-center mb-3">
                  <Text className="text-[#d4856a] m-0 mr-3">🖼️</Text>
                  <Text className="text-[#6b5344] text-sm m-0">
                    Photos and videos
                  </Text>
                </div>
                <div className="flex items-center mb-3">
                  <Text className="text-[#d4856a] m-0 mr-3">📁</Text>
                  <Text className="text-[#6b5344] text-sm m-0">
                    Important documents
                  </Text>
                </div>
                <div className="flex items-center mb-3">
                  <Text className="text-[#d4856a] m-0 mr-3">🔑</Text>
                  <Text className="text-[#6b5344] text-sm m-0">
                    Social media access instructions
                  </Text>
                </div>
              </div>

              {/* Take Your Time Box */}
              <Section className="bg-[#fdf6f0] rounded-lg p-4 mb-4">
                <Text className="text-[#d4856a] font-bold text-sm m-0 mb-1">
                  Take your time
                </Text>
                <Text className="text-[#6b5344] text-sm m-0">
                  Access these whenever you&apos;re ready. There&apos;s no expiration.
                </Text>
              </Section>

              {/* Support Box */}
              <Section className="bg-[#d4856a] rounded-lg p-4 mb-6">
                <Text className="text-white font-bold text-sm m-0 mb-1">
                  You don&apos;t have to do this alone
                </Text>
                <Text className="text-white/90 text-sm m-0">
                  Grief support resources available 24/7.
                </Text>
              </Section>

              {/* CTA Button */}
              <Section className="text-center mb-4">
                <Button
                  href={accessLink}
                  className="bg-[#d4856a] text-white px-8 py-3 rounded-full text-sm font-medium no-underline"
                >
                  View {deceasedName}&apos;s Messages
                </Button>
              </Section>

              {/* Contact Support Link */}
              <Section className="text-center">
                <Link
                  href="mailto:elmail@afterly.com"
                  className="text-[#6b5344] text-sm underline"
                >
                  Contact Support
                </Link>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-[#fdf6f0] px-8 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <Text className="text-[#4a3728] text-xs font-bold m-0 mb-1">
                    24/7 Support Available
                  </Text>
                  <Text className="text-[#6b5344] text-xs m-0">
                    (800) 275-6780
                  </Text>
                  <Text className="text-[#6b5344] text-xs m-0">
                    email: elmail@afterly.com
                  </Text>
                </div>
                <Text className="text-[#d4856a] text-2xl m-0">🕊️</Text>
              </div>
              <Hr className="border-[#e8d4c4] my-4" />
              <Text className="text-[#9a8a7a] text-[10px] text-center m-0">
                This letter is sent to {contactEmail} as a trusted contact.{" "}
                <Link href="#" className="text-[#6b5344] underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#6b5344] underline">
                  Terms of Service
                </Link>
                .
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

DeathNotificationTemplate.PreviewProps = {
  contactName: "Jane Smith",
  contactEmail: "jane.smith@example.com",
  deceasedName: "John",
  accessLink: "https://afterly.com/legacy/abc123token",
};

export default DeathNotificationTemplate;
