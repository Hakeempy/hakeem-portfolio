export type Certification = {
  name: string;
  issuer: string;
  issued: string;
  expires: string;
  validationNumber: string;
  verifyUrl: string;
  badge: { src: string; width: number; height: number };
};

// From the certificate PDF. Anyone can check the validation number on AWS's verification page.
export const certifications: Certification[] = [
  {
    name: "AWS Certified Data Engineer – Associate",
    issuer: "Amazon Web Services",
    issued: "September 2025",
    expires: "September 2028",
    validationNumber: "a584b2fa822543fe911b35cfd8e41484",
    verifyUrl: "https://aws.amazon.com/verification",
    badge: { src: "/images/certs/aws-data-engineer-associate.png", width: 600, height: 600 },
  },
];
