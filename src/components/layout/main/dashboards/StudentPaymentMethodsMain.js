import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import StudentPaymentMethods from "@/components/sections/sub-section/dashboards/StudentPaymentMethods";

const StudentPaymentMethodsMain = () => {
  return (
    <main>
      <HeroPrimary title="Méthodes de Paiement" />
      <StudentPaymentMethods />
    </main>
  );
};

export default StudentPaymentMethodsMain;