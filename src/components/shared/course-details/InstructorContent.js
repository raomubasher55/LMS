import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const InstructorContent = ({ id }) => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch instructor data on component mount
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`
        );
        setInstructor(response.data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstructorData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!instructor) {
    return <div>No instructor data found.</div>;
  }

  const { profile, firstName, lastName, username, bio, skill, instructorProfile } =
    instructor;

  return (
    <div>
      <div
        className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px flex flex-col md:flex-row shadow-autor"
        data-aos="fade-up"
      >
        {/* Instructor avatar */}
        <div className="flex mb-30px mr-5 flex-shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${profile}`}
            alt={username}
            className="w-24 h-24 rounded-full"
            width={96}
            height={96}
          />
        </div>
        <div>
          {/* Instructor name */}
          <div className="mb-3">
            <h3 className="mb-7px">
              <Link
                href={`/instructors/${id}`}
                className="text-xl font-bold text-blackColor2 dark:text-blackColor2-dark hover:text-primaryColor dark:hover:text-primaryColor"
              >
                {firstName} {lastName}
              </Link>
            </h3>
            <p className="text-xs text-contentColor2 dark:text-contentColor2-dark">
              {skill || "Instructor"}
            </p>
          </div>
          {/* Bio */}
          <p className="text-sm text-contentColor dark:text-contentColor-dark mb-15px leading-26px">
            {bio || "No bio available."}
          </p>
          {/* Social links */}
          <div>
            <ul className="flex gap-10px items-center">
              {instructorProfile?.socialLinks?.facebook && (
                <li>
                  <a
                    href={instructorProfile?.socialLinks.facebook}
                    className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                  >
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
              )}
              {instructorProfile?.socialLinks?.twitter && (
                <li>
                  <a
                    href={instructorProfile?.socialLinks.twitter}
                    className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                  >
                    <i className="icofont-twitter"></i>
                  </a>
                </li>
              )}
              {instructorProfile?.socialLinks?.linkedin && (
                <li>
                  <a
                    href={instructorProfile?.socialLinks.linkedin}
                    className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                  >
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
              )}
              {instructorProfile?.socialLinks?.github && (
                <li>
                  <a
                    href={instructorProfile?.socialLinks.github}
                    className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                  >
                    <i className="icofont-github"></i>
                  </a>
                </li>
              )}
              {instructorProfile?.socialLinks?.website && (
                <li>
                  <a
                    href={instructorProfile?.socialLinks.website}
                    className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                  >
                     <i className="icofont-globe"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorContent;
