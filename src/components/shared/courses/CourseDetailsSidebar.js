import BlogContactForm from "../blogs/BlogContactForm";
import BlogSocials from "../blogs/BlogSocials";
import BlogTags from "../blogs/BlogTags";
import CourseEnrollWithPayment from "../course-details/CourseEnrollWithPayment";
import PopularCoursesMini from "../course-details/PopularCoursesMini";

const CourseDetailsSidebar = ({ type, course }) => {
  return (
    <div className="flex flex-col">
      {/* enroll section  */}
      <CourseEnrollWithPayment course={course} />

      {/* social area  */}
      <BlogSocials />

      {/* popular course  */}
      <PopularCoursesMini />

      {/* contact form  */}
      <BlogContactForm />

      {/* tags */}
      <BlogTags course={course} />
    </div>
  );
};

export default CourseDetailsSidebar;
