import SettingsTab from "@/components/shared/dashboards/SettingsTab";
import StudentPaymentMethods from "@/components/sections/sub-section/dashboards/StudentPaymentMethods";

const StudentSettingsMain = () => {
  return (
    <div className="space-y-8">
      <SettingsTab />
      <StudentPaymentMethods />
    </div>
  );
};

export default StudentSettingsMain;
