"use client";
import { useCartContext } from "@/contexts/CartContext";
import useSweetAlert from "@/hooks/useSweetAlert";
import countTotalPrice from "@/libs/countTotalPrice";
import CartProduct from "@/components/shared/cart/CartProduct";
import Link from "next/link";
import { useEffect, useState } from "react";
import TranslatedText from "@/components/shared/TranslatedText";

const CartPrimary = () => {
  const { cartProductsCheck: currentProducts, deleteCartProducts  } = useCartContext();
  const createAlert = useSweetAlert();
  const cartProductsCheck = currentProducts;
  const totalPrice = countTotalPrice(cartProductsCheck);

  // Track loading state
  const [loading, setLoading] = useState(true);

  // Simulate data loading (e.g., from API or context)
  useEffect(() => {
    if (cartProductsCheck && cartProductsCheck.length !== undefined) {
      setLoading(false);
    }
  }, [cartProductsCheck]);

  const isCartProduct = cartProductsCheck?.length || false;

  const handleUpdateCart = () => {
    createAlert("success", "Success! Cart updated.");
  };

  const handleClearCart = () => {
    deleteCartProducts();
    createAlert("success", "Success! Cart cleared.");
  };

  return (
    <section>
      <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
        {/* cert table */}
        <div className="text-contentColor dark:text-contentColor-dark text-size-10 md:text-base overflow-auto">
          <table className="table-fixed md:table-auto leading-1.8 text-center w-150 md:w-full overflow-auto border border-borderColor dark:border-borderColor-dark box-content md:box-border">
            <thead>
              <tr className="md:text-sm text-blackColor dark:text-blackColor-dark uppercase font-medium border-b border-borderColor dark:border-borderColor-dark">
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Image</TranslatedText>
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Produit</TranslatedText>
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Prix</TranslatedText>
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Quantité</TranslatedText>
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Total</TranslatedText>
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  <TranslatedText>Supprimer</TranslatedText>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Check if still loading */}
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <p><TranslatedText>Chargement du panier...</TranslatedText></p>
                  </td>
                </tr>
              ) : !isCartProduct ? (
                <tr className="relative">
                  <td className="p-5 md:p-10">
                    <p className="absolute left-0 top-0 w-full h-full flex items-center justify-center md:text-xl font-bold capitalize opacity-70 ">
                      <TranslatedText>vide</TranslatedText>
                    </p>
                  </td>
                </tr>
              ) : (
                cartProductsCheck?.map((product, idx) => (
                  <CartProduct key={idx} product={product.course} />
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* cart action buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px pt-22px pb-9 md:pt-30px md:pb-55px">
          <div>
            <Link
              href={"/ecommerce/checkout"}
              className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
            >
              <TranslatedText>CONTINUER LES ACHATS</TranslatedText>
            </Link>
          </div>
          {isCartProduct && (
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px">
              <button
                onClick={handleUpdateCart}
                className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
              >
                <TranslatedText>METTRE À JOUR LE PANIER</TranslatedText>
              </button>
              <button
                onClick={handleClearCart}
                className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
              >
                <TranslatedText>VIDER LE PANIER</TranslatedText>
              </button>
            </div>
          )}
        </div>

        {/* cart input */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-30px">
          <div>
            <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor dark:border-borderColor-dark rounded-5px">
              <div className="flex gap-x-4">
                <h3 className="text-lg whitespace-nowrap font-medium text-blackColor dark:text-blackColor-dark mb-22px">
                  <span className="leading-1.2">Estimate Shipping And Tax</span>
                </h3>
                <div className="h-1px w-full bg-borderColor2 dark:bg-borderColor2-dark mt-2"></div>
              </div>
              <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                Enter your destination to get a shipping estimate.
              </p>
              <form>
                <div className="mb-5">
                  <label className="text-blackColor dark:text-blackColor-dark">
                    * Country
                  </label>
                  <select className="text-xs text-blackColor py-9px px-15px w-full rounded box-border border border-blackColor dark:border-blackColor-dark">
                    <option defaultValue="USA">USA</option>
                    <option defaultValue=" UK">UK</option>
                    <option defaultValue="Canada">Canada</option>
                    <option defaultValue="Russia">Russia</option>
                    <option defaultValue="price-ascending">China</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label
                    className="text-blackColor dark:text-blackColor-dark"
                    htmlFor="zip"
                  >
                    * Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="Zip/Postal Code"
                    id="zip"
                    className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor dark:border-borderColor-dark focus:outline-none placeholder:text-placeholder placeholder:opacity-55"
                  />
                </div>
                <div>
                  <Link
                    href="/dashboards/create-course"
                    className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor rounded group text-nowrap"
                  >
                    Calculate shipping
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CartPrimary;
