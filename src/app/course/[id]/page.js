import { redirect } from 'next/navigation';

const CoursePage = ({ params }) => {
  const { id } = params;
  
  // Redirect to the learn page
  redirect(`/course/${id}/learn`);
};

export default CoursePage;