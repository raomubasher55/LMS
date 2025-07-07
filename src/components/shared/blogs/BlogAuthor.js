"use client"
import Image from "next/image";
import blogImag10 from "@/assets/images/blog/blog_10.png";
import Link from "next/link";

const BlogAuthor = ({ author }) => {
  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark text-center"
      data-aos="fade-up"
    >
      {/* athor avatar */}
      <div className="mb-30px flex justify-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${author.profile}`}
          width={96}
          height={96}
          alt="Author Profile"
          className="w-24 h-24 rounded-full"
        />
      </div>
      {/* author name */}
      <div className="mb-3">
        <h3 className="mb-7px">
          <Link
            href="/instructors/2"
            className="text-xl font-bold text-blackColor2 dark:text-blackColor2-dark"
          >
            {author.firstName + " " + author.lastName || "Zahid Ghotia"}
          </Link>
        </h3>
        <p className="text-xs text-contentColor2 dark:text-contentColor2-dark">
          {author.skill || "Admin"}
        </p>
      </div>
      {/* description */}
      <p className="text-sm text-contentColor dark:text-contentColor-dark mb-15px">
        {author.bio || " "}
      </p>
      {/* social */}
      <div>
        <ul className="flex gap-10px justify-center items-center">
          {author.instructorProfile?.socialLinks?.facebook && (
            <li>
              <a
                href={author.instructorProfile?.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
              >
                <i className="icofont-facebook"></i>
              </a>
            </li>
          )}

          {author.instructorProfile?.socialLinks?.twitter && (
            <li>
              <a
                href={author.instructorProfile?.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
              >
                <i className="icofont-twitter"></i>
              </a>
            </li>
          )}

          {author.instructorProfile?.socialLinks?.linkedin && (
            <li>
              <a
                href={author.instructorProfile?.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
              >
                <i className="icofont-linkedin"></i>
              </a>
            </li>
          )}

          {author.instructorProfile?.socialLinks?.github && (
            <li>
              <a
                href={author.instructorProfile?.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
              >
                <i className="icofont-github"></i>
              </a>
            </li>
          )}

          {author.instructorProfile?.socialLinks?.website && (
            <li>
              <a
                href={author.instructorProfile?.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
              >
                <i className="icofont-globe"></i>
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BlogAuthor;
