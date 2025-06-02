import InstructorStats from "@/components/sections/sub-section/dashboards/InstructorStats";
import InstructorRecentActivity from "@/components/sections/sub-section/dashboards/InstructorRecentActivity";
import InstructorQuickActions from "@/components/sections/sub-section/dashboards/InstructorQuickActions";
import InstructorReviews from "@/components/sections/sub-section/dashboards/InstructorReviews";

const InstructorDashbordMain = () => {
  console.log("InstructorDashbordMain rendering...");
  
  return (
    <div className="space-y-30px">
      <div className="p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Instructor Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your instructor dashboard!</p>
      </div>
      
      <InstructorStats />
      <InstructorQuickActions />
      <InstructorRecentActivity />
      <InstructorReviews />
    </div>
  );
};

export default InstructorDashbordMain;
