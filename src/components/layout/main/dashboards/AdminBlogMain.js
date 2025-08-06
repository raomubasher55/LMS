"use client";
import { useState, useEffect } from "react";
import BlogStats from "@/components/sections/sub-section/dashboards/BlogStats";
import BlogList from "@/components/sections/sub-section/dashboards/BlogList";
import CreateBlogModal from "@/components/sections/sub-section/dashboards/CreateBlogModal";
import EditBlogModal from "@/components/sections/sub-section/dashboards/EditBlogModal";
import TranslatedText from "@/components/shared/TranslatedText";

const AdminBlogMain = () => {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  const fetchBlogs = async (page = 1, filterParams = filters) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filterParams).filter(([_, v]) => v))
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching blog stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBlogs(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchBlogs(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchBlogs(page);
  };

  const handleCreateBlog = () => {
    setShowCreateModal(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setShowEditModal(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchBlogs(currentPage);
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleBlogCreated = () => {
    setShowCreateModal(false);
    fetchBlogs(1);
    fetchStats();
  };

  const handleBlogUpdated = () => {
    setShowEditModal(false);
    setSelectedBlog(null);
    fetchBlogs(currentPage);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blackColor dark:text-white">
            <TranslatedText>Gestion du Blog</TranslatedText> {/* Blog Management */}
          </h1>
          <button
            onClick={handleCreateBlog}
            className="px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <TranslatedText>Créer un Nouveau Blog</TranslatedText> {/* Create New Blog */}
          </button>
        </div>
      </div>

      <BlogStats stats={stats} />
      
      <BlogList
        blogs={blogs}
        currentPage={currentPage}
        totalPages={totalPages}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
      />

      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleBlogCreated}
        />
      )}

      {showEditModal && selectedBlog && (
        <EditBlogModal
          blog={selectedBlog}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBlog(null);
          }}
          onSuccess={handleBlogUpdated}
        />
      )}
    </>
  );
};

export default AdminBlogMain;