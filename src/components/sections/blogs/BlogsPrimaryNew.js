"use client";
import { useEffect, useRef, useState } from "react";
import BlogCard from "@/components/shared/blogs/BlogCard";
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
import Pagination from "@/components/shared/others/Pagination";
import TranslatedText from "@/components/shared/TranslatedText";

const BlogsPrimaryNew = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const blogsRef = useRef(null);

  const limit = 6; // Number of blogs per page

  const fetchBlogs = async (page = 1, category = "all", search = "") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category !== "all" && { category }),
        ...(search && { search }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${queryParams}`
      );

      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/categories/lists`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handlePageChange = (page) => {
    if (blogsRef.current) {
      blogsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    fetchBlogs(page, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchBlogs(1, category, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchBlogs(1, selectedCategory, query);
  };

  if (loading && blogs.length === 0) {
    return (
      <section className="py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryColor"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={blogsRef}>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          {/* blogs */}
          <div className="lg:col-start-1 lg:col-span-8">
            {/* Filters */}
            <div className="mb-8 p-6 bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-borderColor dark:border-borderColor-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-whiteColor dark:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-2 border border-borderColor dark:border-borderColor-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-whiteColor dark:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark"
                  >
                    <option value="all">
                      <TranslatedText>Toutes les catégories</TranslatedText>
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primaryColor"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-blackColor dark:text-blackColor-dark mb-4">
                  <TranslatedText>Aucun blog trouvé</TranslatedText>
                </h3>
                <p className="text-contentColor dark:text-contentColor-dark">
                  <TranslatedText>
                    Essayez de modifier votre recherche ou le filtre de
                    catégorie.
                  </TranslatedText>
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {blogs.map((blog, idx) => (
                  <BlogCard blog={blog} key={blog._id} />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-borderColor dark:border-borderColor-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primaryColor hover:text-white hover:border-primaryColor transition-colors"
                      >
                        <TranslatedText>Précédent</TranslatedText>
                      </button>

                      {[...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => handlePageChange(idx + 1)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            currentPage === idx + 1
                              ? "bg-primaryColor text-white border-primaryColor"
                              : "border-borderColor dark:border-borderColor-dark hover:bg-primaryColor hover:text-white hover:border-primaryColor"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-borderColor dark:border-borderColor-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primaryColor hover:text-white hover:border-primaryColor transition-colors"
                      >
                        <TranslatedText>Suivant</TranslatedText>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* blog sidebar */}
          <div className="lg:col-start-9 lg:col-span-4">
            <BlogsSidebar blog={blogs[0]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsPrimaryNew;
