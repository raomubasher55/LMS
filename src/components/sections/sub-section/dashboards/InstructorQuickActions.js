"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import Link from "next/link";

const InstructorQuickActions = () => {
const quickActions = [
  {
    title: <TranslatedText>Créer un nouveau cours</TranslatedText>,
    description: <TranslatedText>Commencez à créer votre prochain cours</TranslatedText>,
    href: "/dashboards/create-course",
    icon: "📚",
    color: "bg-blue/80 hover:bg-blue"
  },
  {
    title: <TranslatedText>Gérer les cours</TranslatedText>,
    description: <TranslatedText>Modifiez et mettez à jour vos cours existants</TranslatedText>,
    href: "/dashboards/instructor-course",
    icon: "⚙️",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: <TranslatedText>Corriger les devoirs</TranslatedText>,
    description: <TranslatedText>Examinez et notez les soumissions des étudiants</TranslatedText>,
    href: "/dashboards/instructor-assignments",
    icon: "📝",
    color: "bg-orange/70 hover:bg-orange"
  },
  {
    title: <TranslatedText>Voir les analyses de quiz</TranslatedText>,
    description: <TranslatedText>Suivez la performance des étudiants aux quiz</TranslatedText>,
    href: "/dashboards/instructor-quiz-analytics",
    icon: "📊",
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    title: <TranslatedText>Progression des étudiants</TranslatedText>,
    description: <TranslatedText>Surveillez la progression de l'apprentissage des étudiants</TranslatedText>,
    href: "/dashboards/instructor-student-progress",
    icon: "👥",
    color: "bg-teal-500 hover:bg-teal-600"
  },
  {
    title: <TranslatedText>Messages</TranslatedText>,
    description: <TranslatedText>Communiquez avec vos étudiants</TranslatedText>,
    href: "/dashboards/instructor-message",
    icon: "💬",
    color: "bg-pink-500 hover:bg-pink-600"
  }
];


  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
      <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
        <TranslatedText>Actions rapides</TranslatedText>
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