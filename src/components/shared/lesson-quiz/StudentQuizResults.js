"use client";

import { useState } from "react";

const StudentQuizResults = ({ allResults, isHeading }) => {
  const [results, setResults] = useState(allResults);

  return (
    <div>
      {!isHeading ? (
        ""
      ) : (
        <h4 className="text-2xl sm:text-size-28 font-bold leading-1.2 text-blackColor dark:text-blackColor-dark mb-15px">
          Quiz Attempts
        </h4>
      )}
      <div className="overflow-auto">
        {!results?.length ? (
          <div className="h-10 flex items-center justify-center font-semibold text-lightGrey4 text-lg md:text-2xl">
            <p>No Quiz Attempts Found</p>
          </div>
        ) : (
          <table className="w-full text-left text-nowrap">
            <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
              <tr>
                <th className="px-5px py-10px md:px-5">Quiz</th>
                <th className="px-5px py-10px md:px-5">Questions</th>
                <th className="px-5px py-10px md:px-5">Score</th>
                <th className="px-5px py-10px md:px-5">Correct Answers</th>
                <th className="px-5px py-10px md:px-5">Result</th>
              </tr>
            </thead>
            <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
              {results?.map(
                (
                  {
                    id,
                    date,
                    title,
                    qus,
                    score,
                    ca,
                    status,
                    courseTitle,
                    chapterTitle,
                  },
                  idx
                ) => (
                  <tr
                    key={idx}
                    className={`leading-1.8 md:leading-1.8 ${
                      idx % 2 === 0
                        ? ""
                        : "bg-lightGrey5 dark:bg-whiteColor-dark"
                    }`}
                  >
                    <td className="px-5px py-10px md:px-5 font-normal">
                      {date ? <p className="text-xs text-gray-500">{date}</p> : ""}
                      <span className="text-blackColor dark:text-blackColor-dark font-bold block">
                        {chapterTitle}
                      </span>
                      <p className="text-sm text-gray-600">
                        Course: {courseTitle}
                      </p>
                    </td>
                    <td className="px-5px py-10px md:px-5">
                      <p>{qus}</p>
                    </td>
                    <td className="px-5px py-10px md:px-5">
                      <p className="font-semibold">{score}%</p>
                    </td>
                    <td className="px-5px py-10px md:px-5">
                      <p>{ca}</p>
                    </td>
                    <td className="px-5px py-10px md:px-5">
                      <p className="text-xs">
                        <span
                          className={`${
                            status === "passed"
                              ? "bg-greencolor2"
                              : "bg-secondaryColor"
                          } h-22px inline-block px-7px leading-22px font-bold text-whiteColor rounded-md capitalize`}
                        >
                          {status}
                        </span>
                      </p>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentQuizResults;