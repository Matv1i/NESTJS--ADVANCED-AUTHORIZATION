import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';
interface ResetPasswordInterface {
  domain: string;
  token: string;
}

export function ResetPasswordTemplateTemplate({
  domain,
  token,
}: ResetPasswordInterface) {
  const resetLink = `${domain}/auth/new-password?tolen=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Reset password</Heading>
          <Text>
            Hello! You want to reset password. Please, click link to make new
            password!
          </Text>
        </Body>
        <Link href={resetLink}>Confirm password reset</Link>
      </Html>
    </Tailwind>
  );
}
