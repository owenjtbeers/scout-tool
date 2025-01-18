import React from "react";
import { ScrollView } from "react-native";
import { Text } from "@rneui/themed";

const privacyPolicyString = `Privacy Policy

Effective Date: [Insert Date]

[Your Company Name] ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy describes how we collect, use, and safeguard the information you provide to us through our mobile application (the "App"). By using the App, you agree to the terms outlined in this Privacy Policy.

1. Information We Collect

a. Information You Provide

Account Information: When you create an account, we collect your name, email address, phone number, and any other details you choose to provide.

Payment Information: If you purchase a subscription, our payment processor collects billing information (e.g., credit card details), but we do not store this information.

Feedback and Support: If you contact us, we may collect the content of your messages and any attachments.

b. Information We Collect Automatically

Device Information: We may collect details about your device, including the device model, operating system, unique device identifiers, and app version.

Usage Data: Information about how you interact with the App, including feature usage, session duration, and crash reports.

Location Information: If you enable location services, we may collect precise or approximate location data to provide personalized features.

2. How We Use Your Information

We use the information we collect to:

Provide and improve the App’s functionality and user experience.

Process payments and manage your subscription.

Respond to your inquiries and provide customer support.

Send you updates, promotions, and relevant notifications (if you’ve opted in).

Monitor and analyze trends to enhance the App’s performance and security.

Comply with legal obligations and enforce our terms of service.

3. Sharing Your Information

We do not sell your personal data. However, we may share your information in the following scenarios:

Service Providers: With trusted third-party vendors that assist in operating the App (e.g., payment processors, analytics providers).

Legal Compliance: When required to comply with legal obligations, respond to lawful requests, or protect our rights.

Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.

4. Data Security

We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.

5. Your Rights and Choices

Depending on your jurisdiction, you may have the following rights:

Access, update, or delete your personal data.

Opt-out of marketing communications.

Restrict or object to certain processing activities.

Withdraw your consent where processing is based on consent.

To exercise these rights, contact us at [Insert Contact Email].

6. Data Retention

We retain your personal data only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. When no longer needed, we securely delete or anonymize your data.

7. Third-Party Links

The App may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties, and we encourage you to review their policies.

8. Children’s Privacy

The App is not intended for use by individuals under the age of 13 (or the minimum age in your jurisdiction). We do not knowingly collect data from children. If we become aware of such data, we will delete it promptly.

9. Changes to This Privacy Policy

We may update this Privacy Policy periodically. Changes will be effective upon posting the revised policy in the App, and your continued use constitutes acceptance of those changes.

10. Contact Us

If you have questions or concerns about this Privacy Policy, contact us at:

Email: [Insert Contact Email]

Address: [Insert Mailing Address]`;

const PrivacyPolicyPage = () => {
  return (
    <ScrollView>
      <h1>Privacy Policy</h1>
      <p>Effective Date: Jan 16, 2025</p>
      <p>
        Grounded Agri-Tools Inc. ("we," "our," or "us") respects your privacy
        and is committed to protecting your personal data. This Privacy Policy
        describes how we collect, use, and safeguard the information you provide
        to us through our mobile application (the "App"). By using the App, you
        agree to the terms outlined in this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>a. Information You Provide</h3>
      <p>
        Account Information: When you create an account, we collect your name,
        email address, phone number, and any other details you choose to
        provide.
      </p>
      <p>
        Payment Information: If you purchase a subscription, our payment
        processor collects billing information (e.g., credit card details), but
        we do not store this information.
      </p>
      <p>
        Feedback and Support: If you contact us, we may collect the content of
        your messages and any attachments.
      </p>

      <h3>b. Information We Collect Automatically</h3>
      <p>
        Device Information: We may collect details about your device, including
        the device model, operating system, unique device identifiers, and app
        version.
      </p>
      <p>
        Usage Data: Information about how you interact with the App, including
        feature usage, session duration, and crash reports.
      </p>
      <p>
        Location Information: If you enable location services, we may collect
        precise or approximate location data to provide personalized features.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>
          Provide and improve the App’s functionality and user experience.
        </li>
        <li>Process payments and manage your subscription.</li>
        <li>Respond to your inquiries and provide customer support.</li>
        <li>
          Send you updates, promotions, and relevant notifications (if you’ve
          opted in).
        </li>
        <li>
          Monitor and analyze trends to enhance the App’s performance and
          security.
        </li>
        <li>Comply with legal obligations and enforce our terms of service.</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell your personal data. However, we may share your
        information in the following scenarios:
      </p>
      <ul>
        <li>
          Service Providers: With trusted third-party vendors that assist in
          operating the App (e.g., payment processors, analytics providers).
        </li>
        <li>
          Legal Compliance: When required to comply with legal obligations,
          respond to lawful requests, or protect our rights.
        </li>
        <li>
          Business Transfers: In the event of a merger, acquisition, or sale of
          assets, your data may be transferred as part of the transaction.
        </li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to
        protect your data from unauthorized access, alteration, disclosure, or
        destruction. However, no method of transmission over the internet or
        electronic storage is completely secure, and we cannot guarantee
        absolute security.
      </p>

      <h2>5. Your Rights and Choices</h2>
      <p>Depending on your jurisdiction, you may have the following rights:</p>
      <ul>
        <li>Access, update, or delete your personal data.</li>
        <li>Opt-out of marketing communications.</li>
        <li>Restrict or object to certain processing activities.</li>
        <li>Withdraw your consent where processing is based on consent.</li>
      </ul>
      <p>To exercise these rights, contact us at admin@groundedag.com</p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal data only as long as necessary to fulfill the
        purposes outlined in this Privacy Policy or as required by law. When no
        longer needed, we securely delete or anonymize your data.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        The App may contain links to third-party websites or services. We are
        not responsible for the privacy practices of these third parties, and we
        encourage you to review their policies.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        The App is not intended for use by individuals under the age of 13 (or
        the minimum age in your jurisdiction). We do not knowingly collect data
        from children. If we become aware of such data, we will delete it
        promptly.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be
        effective upon posting the revised policy in the App, and your continued
        use constitutes acceptance of those changes.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, contact us
        at:
      </p>
      <p>Email: admin@groundedag.com</p>
      {/* <p>Address: [Insert Mailing Address]</p> */}
    </ScrollView>
  );
};

export default PrivacyPolicyPage;
