import BlogDetailsMainNew from "@/components/layout/main/BlogDetailsMainNew";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: "Blog Not Found",
        description: "The requested blog post could not be found."
      };
    }
    
    const data = await response.json();
    const blog = data.blog;
    
    return {
      title: blog.metaTitle || `${blog.title} | Blog`,
      description: blog.metaDescription || blog.excerpt || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.title,
        images: blog.featuredImage ? [`${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`] : [],
        type: 'article',
        publishedTime: blog.publishedAt,
        authors: [blog.author?.firstName + ' ' + blog.author?.lastName],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || blog.title,
        images: blog.featuredImage ? [`${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`] : [],
      }
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found."
    };
  }
}

const BlogDetails = async ({ params }) => {
  const { slug } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    const blog = data.blog;
    
    return (
      <PageWrapper>
        <main>
          <BlogDetailsMainNew blog={blog} />
          <ThemeController />
        </main>
      </PageWrapper>
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }
};

export default BlogDetails;