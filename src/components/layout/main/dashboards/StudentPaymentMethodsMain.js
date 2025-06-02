import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import StudentPaymentMethods from "@/components/sections/sub-section/dashboards/StudentPaymentMethods";

const StudentPaymentMethodsMain = () => {
  return (
    <main>
      <HeroPrimary title="Payment Methods" />
      <StudentPaymentMethods />
    </main>
  );
};

export default StudentPaymentMethodsMain;