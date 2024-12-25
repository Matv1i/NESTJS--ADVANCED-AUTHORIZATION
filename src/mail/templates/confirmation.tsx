import {Html} from "@react-email/html"
import {Body, Heading, Link, Tailwind, Text} from "@react-email/components";
import * as React from 'react';
interface  ConfirmationProps{
    domain:string
    token:string
}

export function ConfirmationTemplate
(
    {
        domain,
        token
    }: ConfirmationProps
){
const confirmLink = `${domain}/auth/new-verification?token=${token}`

    return(
        <Tailwind>
            <Html>
            <Body className="text-black">
                <Heading>Confirmation email</Heading>
                <Text>Hi!To confirm your email, click on the link:</Text>
                <Link href={confirmLink}>Confirm Email</Link>
                <Text>This link is valid for an hour. If you did not request anything, then just ignore this message.</Text>
            </Body>
        </Html>
        </Tailwind>


    )
}