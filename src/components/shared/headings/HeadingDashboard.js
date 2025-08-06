import Link from "next/link";

const HeadingDashboard = ({ children, path }) => {
  return (
    <div
      className={`mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark ${
        path ? "flex items-center justify-between gap-2 flex-wrap" : ""
      }`}
    >
      <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
        {children}
      </h2>
      {path ? (
""
      ) : (
        ""
      )}
    </div>
  );
};

export default HeadingDashboard;
