"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TranslatedText from "../TranslatedText";

const StudentAssignmentResults = ({ allResults, isHeading }) => {
  const [results, setResults] = useState(allResults);
  const router = useRouter();

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "graded":
        return "bg-greencolor2";
      case "submitted":
        return "bg-skycolor";
      case "pending":
        return "bg-primaryColor";
      default:
        return "bg-lightGrey4";
    }
  };

  // Handle redirect to course learning page
  const handleGoToAssignment = (courseId, assignmentId) => {
    if (!courseId || !assignmentId) {
      console.error("Missing courseId or assignmentId for navigation");
      return;
    }
    router.push(`/course/${courseId}/learn#assignment-${assignmentId}`);
  };

  return (
    <div>
      {!isHeading ? (
        ""
      ) : (
        <h4 className="text-2xl sm:text-size-28 font-bold leading-1.2 text-blackColor dark:text-blackColor-dark mb-15px">
          <TranslatedText>Mes Devoirs</TranslatedText>
        </h4>
      )}
      <div className="overflow-auto">
        {!results?.length ? (
          <div className="h-40 flex items-center justify-center font-semibold text-lightGrey4 text-lg md:text-2xl">
            <div className="text-center">
              <i
                className="icofont-file-document mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <p>
                <TranslatedText>Aucun devoir trouvé</TranslatedText>
              </p>
              <p className="text-sm font-normal text-contentColor mt-2">
                <TranslatedText>
                  Inscrivez-vous à des cours pour recevoir des devoirs !
                </TranslatedText>
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left text-nowrap">
            <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
              <tr>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Devoir</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Points</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Statut</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Action</TranslatedText>
                </th>
              </tr>
            </thead>
            <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
              {results?.map((assignment, idx) => (
                <tr
                  key={idx}
                  className={`leading-1.8 md:leading-1.8 ${
                    idx % 2 === 0 ? "" : "bg-lightGrey5 dark:bg-whiteColor-dark"
                  }`}
                >
                  <td className="px-5px py-10px md:px-5 font-normal">
                    <span className="text-blackColor dark:text-blackColor-dark font-bold block">
                      {assignment.title}
                    </span>
                    <p className="text-sm text-gray-600">
                      <TranslatedText>Cours</TranslatedText>:{" "}
                      {assignment.course?.title || "Unknown Course"}
                    </p>
                    {assignment.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {assignment.description.substring(0, 100)}...
                      </p>
                    )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p className="font-medium">{assignment.maxPoints}</p>
                    {assignment.submission?.grade?.points !== undefined &&
                      assignment.submission?.grade?.points !== null && (
                        <p className="text-xs text-gray-500">
                          <TranslatedText>Note obtenue</TranslatedText>:{" "}
                          {assignment.submission.grade.points}
                        </p>
                      )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <span
                      className={`${getStatusColor(assignment.status)} 
                          h-22px inline-block px-7px leading-22px font-bold text-whiteColor rounded-md capitalize text-xs`}
                    >
                      {assignment.status}
                    </span>
                    {assignment.submission?.submittedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        <TranslatedText>Soumis</TranslatedText>:{" "}
                        {new Date(
                          assignment.submission?.submittedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <div className="dashboard__button__group">
                      {assignment.status === "pending" ? (
                        <button
                          onClick={() =>
                            handleGoToAssignment(
                              assignment.course?._id,
                              assignment._id
                            )
                          }
                          disabled={!assignment.course?._id}
                          className={`flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-whiteColor
                              bg-primaryColor hover:bg-blue-600
                              border border-transparent h-30px w-full px-14px leading-30px justify-center rounded-md my-5px
                              ${
                                !assignment.course?._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                        >
                          <i className="icofont-paper-plane mr-1"></i>
                          <TranslatedText>Soumettre maintenant</TranslatedText>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleGoToAssignment(
                              assignment.course?._id,
                              assignment._id
                            )
                          }
                          disabled={!assignment.course?._id}
                          className={`flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-whiteColor bg-skycolor hover:bg-blue-500 
                              border border-transparent h-30px w-full px-14px leading-30px justify-center rounded-md my-5px
                              ${
                                !assignment.course?._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                        >
                          <i className="icofont-eye mr-1"></i>
                          <TranslatedText>Voir les Détails</TranslatedText>
                        </button>
                      )}

                      {assignment.submission?.grade?.feedback && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            <TranslatedText>Retour</TranslatedText>:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {assignment.submission?.grade?.feedback?.substring(
                              0,
                              100
                            )}
                            {assignment.submission?.grade?.feedback?.length >
                              100 && "..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentResults;
