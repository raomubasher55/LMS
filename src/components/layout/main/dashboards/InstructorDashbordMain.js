import InstructorStats from "@/components/sections/sub-section/dashboards/InstructorStats";
import InstructorRecentActivity from "@/components/sections/sub-section/dashboards/InstructorRecentActivity";
import InstructorQuickActions from "@/components/sections/sub-section/dashboards/InstructorQuickActions";
import InstructorReviews from "@/components/sections/sub-section/dashboards/InstructorReviews";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorDashbordMain = () => {
  console.log("InstructorDashbordMain rendering...");

  return (
    <div className="space-y-30px">
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          <TranslatedText>Tableau de bord de l'instructeur</TranslatedText>
        </h1>
        <p className="text-gray-600">
          <TranslatedText>
            Bienvenue sur votre tableau de bord instructeur&nbsp;!
          </TranslatedText>
        </p>
      </div>

      <InstructorStats />
      <InstructorQuickActions />
      <InstructorRecentActivity />
      <InstructorReviews />
    </div>
  );
};

export default InstructorDashbordMain;
