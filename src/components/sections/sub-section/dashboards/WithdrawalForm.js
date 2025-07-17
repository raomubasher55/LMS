"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import { useState } from "react";

const WithdrawalForm = ({ availableBalance, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    accountNumber: "",
    accountName: "",
    bankName: "",
    accountType: "savings",
    routingNumber: "",
    swiftCode: "",
    branchAddress: "",
    paymentMethod: "bank_transfer",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parseFloat(formData.amount) < 10) {
      newErrors.amount = "Minimum withdrawal amount is $10";
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = `Amount cannot exceed available balance ($${availableBalance.toFixed(
        2
      )})`;
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setErrors({
          submit: errorData.message || "Failed to submit withdrawal request",
        });
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <TranslatedText>Demander un retrait</TranslatedText>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <TranslatedText>Solde disponible</TranslatedText>:{" "}
            <span className="font-semibold text-green-600">
              ${availableBalance.toFixed(2)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <TranslatedText>Détails du retrait</TranslatedText>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Montant du retrait</TranslatedText> *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="10"
                  max={availableBalance}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Méthode de paiement</TranslatedText>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                >
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="paypal">PayPal</option>
                  <option value="wire_transfer">Virement télégraphique</option>
                  <option value="check">Chèque</option>
                  <option value="crypto">Cryptomonnaie</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <TranslatedText>Détails du compte bancaire</TranslatedText>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Numéro de compte</TranslatedText> *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                  placeholder="Entrez le numéro de compte"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Nom du compte</TranslatedText> *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                  placeholder="Entrez le nom du titulaire du compte"
                />
                {errors.accountName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Nom de la banque</TranslatedText> *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                  placeholder="Entrez le nom de la banque"
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TranslatedText>Type de compte</TranslatedText>
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
              >
                <option value="savings">
                  <TranslatedText>Épargne</TranslatedText>
                </option>
                <option value="checking">
                  <TranslatedText>Courant</TranslatedText>
                </option>
                <option value="business">
                  <TranslatedText>Professionnel</TranslatedText>
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TranslatedText>Numéro de routage</TranslatedText>
              </label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                placeholder="Entrez le numéro de routage (facultatif)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SWIFT Code
              </label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                placeholder="Entrez le SWIFT code (facultatif)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TranslatedText>Adresse de l'agence</TranslatedText>
              </label>
              <input
                type="text"
                name="branchAddress"
                value={formData.branchAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                placeholder="Entrez l'adresse de l'agence (facultatif)"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TranslatedText>Annuler</TranslatedText>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <TranslatedText>Soumission...</TranslatedText>
              ) : (
                <TranslatedText>Soumettre la demande</TranslatedText>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalForm;
