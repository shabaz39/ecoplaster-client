// ecoplaster-client/src/components/AdminDashboardComponents/AdminDashboard.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import StatsCards from './Dashboard/StatsCards';
import ControlPanel from './Dashboard/ControlPanel';
import UserList from './UserManagement/UserList';
import DealerList from './DealerManagement/DealerList';
import AnnouncementList from './Announcements/AnnouncementList';
import ContactList from './ContactManagement/ContactList';
import ProductManagement from './ProductManagement/ProductManagement';
import PromotionManagement from './PromotionManagement/PromotionManagement';
import { BlogForm } from '@/components/BlogPostComponents/BlogForm';
import { BlogList } from '@/components/BlogPostComponents/BlogList';
import { BlogFormData, IBlog } from '@/types/blog.types';
import {
  GET_ALL_BLOGS,
  CREATE_BLOG,
  UPDATE_BLOG,
  DELETE_BLOG,
  PUBLISH_BLOG
} from '@/constants/queries/blogQueries';
import { GET_ALL_CONTACTS } from '@/constants/queries/allGETrequests';
import LoadingSpinner from './Common/LoadingSpinner';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TabType {
  id: string;
  label: string;
  icon?: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showBlogForm, setShowBlogForm] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);

  // Queries
  const { data: blogsData, loading: blogsLoading, refetch: refetchBlogs } = useQuery(GET_ALL_BLOGS);
  const { data: contactsData, loading: contactsLoading } = useQuery(GET_ALL_CONTACTS);

  const router = useRouter();

  // Blog mutations
  const [createBlog] = useMutation(CREATE_BLOG);
  const [updateBlog] = useMutation(UPDATE_BLOG);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const [publishBlog] = useMutation(PUBLISH_BLOG);

  const tabs: TabType[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },  // Add this line
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'promotions', label: 'Promotions', icon: '🏷️' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'dealers', label: 'Dealers', icon: '🏪' },
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'contacts', label: 'Contact Messages', icon: '✉️' }
  ];

  // Add this function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      // Redirect to home page after sign out
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateBlog = async (formData: BlogFormData, files: File[]) => {
    try {
      if (!files.length) {
        alert("Please select at least one image");
        return;
      }

      const uploadFiles = files.map(file => new File(
        [file],
        file.name,
        { type: file.type, lastModified: new Date().getTime() }
      ));

      const { data } = await createBlog({
        variables: {
          input: {
            ...formData,
            metaTags: formData.metaTags.split(",").map(tag => tag.trim()),
            published: false
          },
          files: uploadFiles
        }
      });

      if (data?.createBlog) {
        alert("Blog created successfully!");
        setShowBlogForm(false);
        refetchBlogs();
      }
    } catch (error: any) {
      console.error("Error creating blog:", error);
      alert(`Failed to create blog: ${error.message}`);
    }
  };

  const handleUpdateBlog = async (formData: BlogFormData, files: File[]) => {
    if (!editingBlog) return;
    try {
      await updateBlog({
        variables: {
          id: editingBlog.id,
          input: {
            ...formData,
            metaTags: formData.metaTags.split(',').map(tag => tag.trim())
          },
          files: files.length > 0 ? files : undefined
        }
      });
      setEditingBlog(null);
      setShowBlogForm(false);
      refetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await deleteBlog({ variables: { id } });
      refetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handlePublishBlog = async (id: string) => {
    try {
      const { data } = await publishBlog({ variables: { id } });
      if (data?.publishBlog?.url) {
        window.open(data.publishBlog.url, '_blank');
      }
      refetchBlogs();
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog');
    }
  };

  return (
    <div className="min-h-screen bg-beige lg:px-64">
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-productNameColor">Welcome Back,</h1>
          <h2 className="text-xl font-semibold text-greenComponent">Admin</h2>
          <p className="text-sm text-newgreensecond">Manage your website content</p>
        </div>
        <div className="text-greenComponent">
          <button className="text-lg hover:text-newgreen transition-colors">
            <span role="img" aria-label="admin-icon">🛠️</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-6 py-4 bg-white border-b border-cream">
        <nav className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-greenComponent text-white'
                  : 'text-newgreensecond hover:bg-cream'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <>
            <StatsCards setActiveTab={setActiveTab} />
            <ControlPanel />
          </>
        )}

{activeTab === 'orders' && (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-productNameColor">Orders</h3>
      <a 
        href="/adminDashboard/orders" 
        className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
      >
        Manage Orders
      </a>
    </div>
  )}

        {activeTab === 'products' && <ProductManagement />}
        
        {activeTab === 'promotions' && <PromotionManagement />}

        {activeTab === 'announcements' && <AnnouncementList />}
        
        {activeTab === 'users' && <UserList />}
        
        {activeTab === 'dealers' && <DealerList />}

        {activeTab === 'contacts' && (
          <ContactList 
            contacts={contactsData?.getContacts || []} 
            loading={contactsLoading} 
          />
        )}

        {activeTab === 'blogs' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-productNameColor">Blogs</h3>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setShowBlogForm(!showBlogForm);
                }}
                className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
              >
                <span className="flex items-center gap-2">
                  {showBlogForm ? "✕ Close Form" : "✚ Create New Blog"}
                </span>
              </button>
            </div>

            {showBlogForm && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg text-productNameColor font-medium mb-4">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h4>
                <BlogForm
                  onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
                  initialData={editingBlog ? {
                    title: editingBlog.title,
                    body: editingBlog.body,
                    metaTags: editingBlog.metaTags.join(', '),
                    author: editingBlog.author
                  } : undefined}
                  loading={false}
                />
              </div>
            )}

            <div className="mt-8">
              {blogsLoading ? (
                <LoadingSpinner />
              ) : (
                <BlogList
                  blogs={blogsData?.getAllBlogs || []}
                  onPublish={handlePublishBlog}
                  onDelete={handleDeleteBlog}
                  onEdit={(blog: IBlog) => {
                    setEditingBlog(blog);
                    setShowBlogForm(true);
                  }}
                />
              )}
            </div>
          </section>
        )}
      </div>

      {/* Admin Account Section */}
      <section className="px-6 py-8 border-t border-cream">
        <h3 className="text-lg font-semibold text-productNameColor">Admin Account</h3>
        <ul className="mt-4 space-y-2">
          <li 
            onClick={() => setActiveTab('users')} 
            className="text-newgreensecond hover:text-greenComponent cursor-pointer transition-colors flex items-center gap-2"
          >
            <span>👥</span>
            Manage Users
          </li>
          <li 
            className="text-newgreensecond hover:text-greenComponent cursor-pointer transition-colors flex items-center gap-2"
          >
            <span>⚙️</span>
            Settings
          </li>
          <li 
            onClick={handleSignOut}
            className="text-newgreensecond hover:text-greenComponent cursor-pointer transition-colors flex items-center gap-2"
          >
            <span>🚪</span>
            Sign Out
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;