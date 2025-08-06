"use client";
import { useState } from "react";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { toast } from "react-toastify";
import TranslatedText from "@/components/shared/TranslatedText";

const StudentPaymentMethods = () => {
  const { paymentMethods, loading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "credit_card",
    cardDetails: {
      lastFour: "",
      brand: "",
      expiryMonth: "",
      expiryYear: "",
      nameOnCard: ""
    },
    paypalDetails: {
      email: ""
    },
    bankDetails: {
      accountName: "",
      lastFour: "",
      bankName: ""
    },
    isDefault: false,
    paymentToken: "dummy-token-123" // In a real app, this would come from a payment processor
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setFormData({
        ...formData,
        [group]: {
          ...formData[group],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addPaymentMethod(formData);
    if (success) {
      setShowAddForm(false);
      setFormData({
        type: "credit_card",
        cardDetails: {
          lastFour: "",
          brand: "",
          expiryMonth: "",
          expiryYear: "",
          nameOnCard: ""
        },
        paypalDetails: {
          email: ""
        },
        bankDetails: {
          accountName: "",
          lastFour: "",
          bankName: ""
        },
        isDefault: false,
        paymentToken: "dummy-token-123"
      });
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    await updatePaymentMethod(paymentMethodId, { isDefault: true });
  };

  const handleDelete = async (paymentMethodId) => {
    await deletePaymentMethod(paymentMethodId);
  };

  // Helper to render payment method icon
  const renderPaymentIcon = (type, details) => {
    if (type === "credit_card") {
      const brand = details?.brand?.toLowerCase() || "";
      if (brand.includes("visa")) return "💳 Visa";
      if (brand.includes("mastercard")) return "💳 Mastercard";
      if (brand.includes("amex") || brand.includes("american")) return "💳 Amex";
      return "💳 Card";
    }
    if (type === "paypal") return "PayPal";
    if (type === "bank_account") return "🏦 Bank";
    return "💰";
  };

  // Helper to get payment method details
  const getPaymentDetails = (method) => {
    if (method.type === "credit_card") {
      return `•••• ${method.cardDetails.lastFour} | Exp: ${method.cardDetails.expiryMonth}/${method.cardDetails.expiryYear}`;
    }
    if (method.type === "paypal") {
      return method.paypalDetails.email;
    }
    if (method.type === "bank_account") {
      return `${method.bankDetails.bankName || "Bank"} •••• ${method.bankDetails.lastFour}`;
    }
    return "";
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          <TranslatedText>Méthodes de Paiement</TranslatedText>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
        </div>
      ) : (
        <div className="mb-8">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
<TranslatedText>Vous n'avez encore enregistré aucune méthode de paiement.</TranslatedText>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method._id}
                  className={`flex justify-between items-center p-4 rounded-md ${
                    method.isDefault
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {renderPaymentIcon(
                        method.type,
                        method.type === "credit_card"
                          ? method.cardDetails
                          : method.type === "paypal"
                          ? method.paypalDetails
                          : method.bankDetails
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {method.type === "credit_card"
                          ? method.cardDetails.nameOnCard
                          : method.type === "bank_account"
                          ? method.bankDetails.accountName
                          : "PayPal Account"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {getPaymentDetails(method)}
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 py-1 px-2 rounded mt-1 inline-block">
                          <TranslatedText>Par Défaut</TranslatedText>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method._id)}
                        className="text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 py-1 px-3 rounded"
                      >
                       <TranslatedText>Définir par Défaut</TranslatedText>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method._id)}
                      className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 py-1 px-3 rounded"
                    >
                      <TranslatedText>Supprimer</TranslatedText>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Payment Method Button */}
      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-primaryColor text-white py-3 px-4 rounded-md hover:bg-primaryColor/90 font-medium"
          >
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <TranslatedText>Ajouter une Nouvelle Méthode de Paiement</TranslatedText>
          </button>
        </div>
      )}

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            <TranslatedText>Ajouter une Méthode de Paiement</TranslatedText>

          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <TranslatedText>Type de Paiement</TranslatedText>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                required
              >
<option value="credit_card"><TranslatedText>Carte de Crédit/Débit</TranslatedText></option>
<option value="paypal"><TranslatedText>PayPal</TranslatedText></option>
<option value="bank_account"><TranslatedText>Compte Bancaire</TranslatedText></option>

              </select>
            </div>

            {/* Conditional fields based on payment type */}
            {formData.type === 'credit_card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <TranslatedText>Nom sur la Carte</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="cardDetails.nameOnCard"
                    value={formData.cardDetails.nameOnCard}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <TranslatedText>Marque de la Carte</TranslatedText>
                  </label>
                  <select
                    name="cardDetails.brand"
                    value={formData.cardDetails.brand}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    required
                  >
<option value=""><TranslatedText>Sélectionner le Type de Carte</TranslatedText></option>
<option value="visa"><TranslatedText>Visa</TranslatedText></option>
<option value="mastercard"><TranslatedText>Mastercard</TranslatedText></option>
<option value="amex"><TranslatedText>American Express</TranslatedText></option>
<option value="discover"><TranslatedText>Discover</TranslatedText></option>

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <TranslatedText>Derniers 4 Chiffres</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="cardDetails.lastFour"
                    value={formData.cardDetails.lastFour}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    pattern="[0-9]{4}"
                    maxLength="4"
                    placeholder="1234"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <TranslatedText>Mois d'Expiration</TranslatedText>
                    </label>
                    <select
                      name="cardDetails.expiryMonth"
                      value={formData.cardDetails.expiryMonth}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        return (
                          <option key={month} value={month}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Year
                    </label>
                    <select
                      name="cardDetails.expiryYear"
                      value={formData.cardDetails.expiryYear}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  name="paypalDetails.email"
                  value={formData.paypalDetails.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                  required
                />
              </div>
            )}

            {formData.type === 'bank_account' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountName"
                    value={formData.bankDetails.accountName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last 4 Digits
                  </label>
                  <input
                    type="text"
                    name="bankDetails.lastFour"
                    value={formData.bankDetails.lastFour}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
                    pattern="[0-9]{4}"
                    maxLength="4"
                    placeholder="1234"
                    required
                  />
                </div>
              </div>
            )}

            {/* Set as default option */}
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primaryColor focus:ring-primaryColor"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set as default payment method
                </span>
              </label>
            </div>

            {/* Form actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primaryColor hover:bg-primaryColor/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor"
              >
                Add Payment Method
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentPaymentMethods;