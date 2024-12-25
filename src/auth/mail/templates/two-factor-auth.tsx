import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';
interface TwoFactorInterface {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorInterface) {
  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Two Factor Auth</Heading>
          <Text>Your code of verification:{token}</Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
