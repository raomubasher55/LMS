import React from "react";

const AllUserContent = ({ users }) => {
  const getProfileImage = (user) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profile}` ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(`${user.firstName} ${user.lastName}`) +
      "&background=random";

  return (
    <div className="overflow-auto">
      {/* Table header */}
      <table className="w-[550px] sm:w-full text-left">
        <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
          <tr className="w-full">
            <th className="px-5px py-10px md:px-5 w-[30%]">Name</th>
            <th className="px-5px py-10px md:px-5 w-[25%]">Email</th>
            <th className="px-5px py-10px md:px-5 w-[20%]">Role</th>
            <th className="px-5px py-10px md:px-5 w-[25%]">Join Date</th>
          </tr>
        </thead>
      </table>

      {/* Table body */}
      <div className={users.length > 5 ? "max-h-[400px] overflow-y-auto" : ""}>
        <table className="w-max sm:w-full text-left">
          <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
            {users.map((user, index) => (
              <tr
                key={index}
                className="leading-1.8 md:leading-1.8 border-b border-borderColor dark:border-borderColor-dark"
              >
                <td className="flex items-center gap-3 px-5px py-10px md:px-5 w-[40%] sm:w-max">
                  <img
                    src={getProfileImage(user)}
                    alt="Profile"
                    className="w-36 sm:w-auto h-10 rounded-full object-cover border border-borderColor"
                  />
                  <div className="text-blackColor dark:text-blackColor-dark font-medium">
                    <span className="inline lg:hidden">{user.firstName}</span>
                    <span className="hidden lg:inline">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-5px py-10px md:px-5 w-[25%] text-nowrap">
                  {user.email}
                </td>
                <td className="px-5px py-10px md:px-5 w-[20%] capitalize">
                  <span className="px-2 py-1 rounded bg-lightGrey5 dark:bg-whiteColor-dark text-sm font-semibold inline-block">
                    {user.role}
                  </span>
                </td>
                <td className="px-5px py-10px md:px-5 w-[25%] text-nowrap">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUserContent;
