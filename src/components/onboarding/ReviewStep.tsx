import React from "react";

interface ReviewStepProps {
  companyInfo: any; // Replace with your CompanyInfo interface as appropriate.
}

const ReviewStep: React.FC<ReviewStepProps> = ({ companyInfo }) => (
  <div>
    <h3>Review Your Information</h3>
    <p>Please confirm that the following details are correct:</p>
    <ul>
      <li>
        <strong>Company Name:</strong> {companyInfo.companyName || "N/A"}
      </li>
      <li>
        <strong>Address:</strong> {companyInfo.address || "N/A"}
      </li>
      <li>
        <strong>City:</strong> {companyInfo.city || "N/A"}
      </li>
      <li>
        <strong>{companyInfo.country === "Canada" ? "Province" : "State"}:</strong>{" "}
        {companyInfo.state || "N/A"}
      </li>
      <li>
        <strong>Zip/Postal Code:</strong> {companyInfo.zip || "N/A"}
      </li>
      <li>
        <strong>Country:</strong> {companyInfo.country || "N/A"}
      </li>
      <li>
        <strong>Payment Method:</strong> {companyInfo.paymentMethod || "N/A"}
      </li>
      {companyInfo.paymentMethod === "credit_card" && (
        <>
          <li>
            <strong>Card Type:</strong> {companyInfo.cardType || "N/A"}
          </li>
          <li>
            <strong>Card Number:</strong> {companyInfo.cardNumber || "N/A"}
          </li>
          <li>
            <strong>Expiry Date:</strong> {companyInfo.cardExpiry || "N/A"}
          </li>
          <li>
            <strong>Save Card Information:</strong> {companyInfo.saveCardInfo ? "Yes" : "No"}
          </li>
        </>
      )}
      {companyInfo.paymentMethod === "bank_transfer" && (
        <>
          <li>
            <strong>Bank Account Number:</strong> {companyInfo.bankAccountNumber || "N/A"}
          </li>
          <li>
            <strong>Bank Routing Number:</strong> {companyInfo.bankRoutingNumber || "N/A"}
          </li>
          <li>
            <strong>Authorized Fund Request:</strong>{" "}
            {companyInfo.authorizeBankTransfer ? "Yes" : "No"}
          </li>
        </>
      )}
      {companyInfo.paymentMethod === "paypal" && (
        <li>
          <strong>PayPal Account Linked:</strong> {companyInfo.paypalLinked ? "Yes" : "No"}
        </li>
      )}
      <li>
        <strong>Billing Address:</strong>{" "}
        {companyInfo.billingAddress || "N/A"}, {companyInfo.billingCity || "N/A"}, {companyInfo.billingState || "N/A"}, {companyInfo.billingZip || "N/A"},{" "}
        {companyInfo.billingCountry || "N/A"}
      </li>
    </ul>
  </div>
);

export default ReviewStep;
