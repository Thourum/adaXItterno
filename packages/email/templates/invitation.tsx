import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type InvitationTemplateProps = {
  readonly recipientName?: string;
  readonly recipientEmail: string;
  readonly signUpUrl: string;
};

const baseUrl = "https://ada-x-itterno-web.vercel.app";

/**
 * Welcome/Invitation Email Template for Afterly
 * Sent when an insurance company invites a new user to join.
 */
export const InvitationTemplate = ({
  recipientName,
  recipientEmail,
  signUpUrl,
}: InvitationTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Welcome to Afterly - Let&apos;s Get Started</Preview>
      <Body className="bg-[#f5ebe0] font-sans m-0 p-0">
        {/* Header with Logo */}
        <Section className="bg-[#d4856a] py-6 text-center">
          <Img
            src={`${baseUrl}/media/logo-white.png`}
            alt="Afterly"
            width="120"
            height="40"
            className="mx-auto"
          />
        </Section>

        <Container className="mx-auto max-w-[600px]">
          {/* Title */}
          <Section className="bg-[#fdf6f0] px-8 pt-8 text-center">
            <Text className="text-[#8b4513] text-2xl font-serif m-0">
              Welcome to Afterly - Let&apos;s Get Started
            </Text>
          </Section>

          {/* Hero Image */}
          <Section className="bg-[#fdf6f0] px-8">
            <Img
              src={`${baseUrl}/media/Image%202%20-%20Feature%20Section%20Protect%20What%20Matters.png`}
              alt="Caring hands holding a phone"
              width="100%"
              className="rounded-lg"
            />
          </Section>

          {/* Welcome Message */}
          <Section className="bg-[#fdf6f0] px-8 py-6 text-center">
            <Text className="text-[#5a3825] text-xl font-semibold m-0 mb-4">
              Welcome! We&apos;re Here to Support You
            </Text>
            <Text className="text-[#6b5344] text-sm leading-6 m-0">
              We&apos;re a warm, compassionate platform. Afterly helps you
              maintain your digital legacy, organize your digital assets, and
              bring peace of mind to you and your loved ones.
            </Text>
          </Section>

          {/* What Happens Next */}
          <Section className="bg-[#fdf6f0] px-8 pb-6 text-center">
            <Text className="text-[#5a3825] text-lg font-semibold m-0 mb-6">
              Here&apos;s What Happens Next
            </Text>
            <Row>
              <Column className="text-center px-2">
                <div className="mx-auto w-12 h-12 bg-[#e8d4c4] rounded-full flex items-center justify-center mb-2">
                  <Text className="text-[#d4856a] text-2xl m-0">👤</Text>
                </div>
                <Text className="text-[#6b5344] text-xs m-0">
                  Complete Your Profile
                </Text>
              </Column>
              <Column className="text-center px-2">
                <div className="mx-auto w-12 h-12 bg-[#e8d4c4] rounded-full flex items-center justify-center mb-2">
                  <Text className="text-[#d4856a] text-2xl m-0">📄</Text>
                </div>
                <Text className="text-[#6b5344] text-xs m-0">
                  Add Your Digital Assets
                </Text>
              </Column>
              <Column className="text-center px-2">
                <div className="mx-auto w-12 h-12 bg-[#e8d4c4] rounded-full flex items-center justify-center mb-2">
                  <Text className="text-[#d4856a] text-2xl m-0">🛡️</Text>
                </div>
                <Text className="text-[#6b5344] text-xs m-0">
                  Secure Your Legacy
                </Text>
              </Column>
            </Row>
          </Section>

          {/* CTA Button */}
          <Section className="bg-[#fdf6f0] px-8 pb-8 text-center">
            <Button
              href={signUpUrl}
              className="bg-[#d4856a] text-white px-8 py-3 rounded-full text-sm font-medium no-underline"
            >
              Complete Your Profile
            </Button>
          </Section>

          {/* Footer */}
          <Section className="bg-[#6b5344] px-8 py-6 text-center">
            <Row className="mb-4">
              <Column className="text-center">
                <Link href="#" className="text-white mx-2 no-underline">
                  <Text className="inline m-0">📘</Text>
                </Link>
                <Link href="#" className="text-white mx-2 no-underline">
                  <Text className="inline m-0">🐦</Text>
                </Link>
                <Link href="#" className="text-white mx-2 no-underline">
                  <Text className="inline m-0">📷</Text>
                </Link>
                <Link href="#" className="text-white mx-2 no-underline">
                  <Text className="inline m-0">💼</Text>
                </Link>
              </Column>
            </Row>
            <Text className="text-white text-xs m-0 mb-2">
              support@afterly.com | 1-800-AFTERLY
            </Text>
            <Text className="text-white/70 text-xs m-0">
              <Link href="#" className="text-white/70 underline">
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

InvitationTemplate.PreviewProps = {
  recipientName: "Jane Smith",
  recipientEmail: "jane.smith@example.com",
  signUpUrl: "https://afterly.com/sign-up",
};

export default InvitationTemplate;
