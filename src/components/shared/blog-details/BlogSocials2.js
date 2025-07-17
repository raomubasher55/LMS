import Link from "next/link";

const BlogSocials2 = ({ courseId }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const courseUrl = `${baseUrl}/courses/${courseId}`;

  return (
    <div>
      <ul className="flex gap-10px justify-center items-center">
        <li>
          <p className="text-lg md:text-size-22 leading-7 md:leading-30px text-blackColor dark:text-blackColor-dark font-bold">
            Share
          </p>
        </li>

        {/* Twitter Share Link */}
        <li>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(courseUrl)}&text=Check%20out%20this%20course!`}
            className="h-35px w-35px leading-35px md:w-38px md:h-38px md:leading-38px text-size-11 md:text-xs text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
          >
            <i className="icofont-twitter"></i>
          </Link>
        </li>

        {/* Facebook Share Link */}
        <li>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`}
            className="h-35px w-35px leading-35px md:w-38px md:h-38px md:leading-38px text-size-11 md:text-xs text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
          >
            <i className="icofont-facebook"></i>
          </Link>
        </li>

        {/* Instagram Share Link */}
        <li>
          <Link
            href={`https://www.instagram.com/share?url=${encodeURIComponent(courseUrl)}`}
            className="h-35px w-35px leading-35px md:w-38px md:h-38px md:leading-38px text-size-11 md:text-xs text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
          >
            <i className="icofont-instagram"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default BlogSocials2;
