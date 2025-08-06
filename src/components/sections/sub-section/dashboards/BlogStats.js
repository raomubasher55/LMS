"use client";

import TranslatedText from "@/components/shared/TranslatedText";

const BlogStats = ({ stats }) => {
  const statCards = [
    {
      title: <TranslatedText>Articles Totaux</TranslatedText>,
      value: stats.totalBlogs || 0,
      icon: "📝",
      color: "bg-blue-500"
    },
    {
       title: <TranslatedText>Publié</TranslatedText>,
      value: stats.publishedBlogs || 0,
      icon: "✅",
      color: "bg-green-500"
    },
    {
       title: <TranslatedText>Brouillons</TranslatedText>,
      value: stats.draftBlogs || 0,
      icon: "📋",
      color: "bg-yellow-500"
    },
    {
   title: <TranslatedText>Total des Vues</TranslatedText>,
      value: stats.totalViews || 0,
      icon: "👀",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogStats;