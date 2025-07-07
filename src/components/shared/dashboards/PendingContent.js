import CourseCard from "../courses/CourseCard";

const PendingContent = ({ courses , instructor , role }) => {
  return courses?.map((course) => (
    <CourseCard key={course._id} course={course} instructor={instructor} role={role} type={"primary"} />
  ));
};

export default PendingContent;
