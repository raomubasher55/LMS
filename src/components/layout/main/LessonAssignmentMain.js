"use client";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import StudentAssignmentsContent from "@/components/sections/sub-section/dashboards/StudentAssignmentsContent";
import { useSearchParams } from "next/navigation";

const LessonAssignmentMain = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  
  return (
    <>
      <HeroPrimary path={"Assignment"} title={"Course Assignments"} />
      {!courseId ? (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Warning!</strong>
            <span className="block sm:inline"> No course ID provided. Please select a course to view assignments.</span>
          </div>
        </div>
      ) : (
        <StudentAssignmentsContent courseId={courseId} />
      )}
    </>
  );
};

export default LessonAssignmentMain;
