"use client";
import Link from "next/link";

const InstructorQuickActions = () => {
  const quickActions = [
    {
      title: "Create New Course",
      description: "Start building your next course",
      href: "/dashboards/create-course",
      icon: "📚",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Courses",
      description: "Edit and update your existing courses",
      href: "/dashboards/instructor-course",
      icon: "⚙️",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Grade Assignments",
      description: "Review and grade student submissions",
      href: "/dashboards/instructor-assignments",
      icon: "📝",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "View Quiz Analytics",
      description: "Track student quiz performance",
      href: "/dashboards/instructor-quiz-analytics",
      icon: "📊",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Student Progress",
      description: "Monitor student learning progress",
      href: "/dashboards/instructor-student-progress",
      icon: "👥",
      color: "bg-teal-500 hover:bg-teal-600"
    },
    {
      title: "Messages",
      description: "Communicate with your students",
      href: "/dashboards/instructor-message",
      icon: "💬",
      color: "bg-pink-500 hover:bg-pink-600"
    }
  ];

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
      <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`${action.color} text-white p-6 rounded-lg transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{action.icon}</div>
              <h4 className="font-semibold text-lg mb-2">{action.title}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InstructorQuickActions;