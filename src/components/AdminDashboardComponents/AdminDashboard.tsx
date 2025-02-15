"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
import { getAllAnnouncement } from '@/constants/queries/getAllAnnouncementsQuery';
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
import { useSession } from 'next-auth/react';


const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($message: String!) {
    createAnnouncement(message: $message) {
      id
      message
    }
  }
`;

const DELETE_ANNOUNCEMENT = gql`
mutation DeleteAnnouncement($id: ID!) {
  deleteAnnouncement(id: $id) {
    id
    message
    createdAt
    active
  }
}
`;

const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: String, $message: String!) {
    updateAnnouncement(id: $id, message: $message) {
      id
      message
    }
  }
`;

interface Announcement {
  id: string;
  message: string;
}

interface EditingAnnouncement {
  id: string;
  message: string;
}

const AdminDashboard: React.FC = () => {
  const { data: session } = useSession();



  const orders = ["Order1", "Order2", "Order3"];
  const controls = ["Homepage Banner", "Product Listings", "Promotions"];
  const blogs = [
    { title: "New Arrivals", status: "Published" },
    { title: "Product Reviews", status: "Draft" },
    { title: "Company Updates", status: "Published" }
  ];

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState<EditingAnnouncement | null>(null);

  const { data: announcementData, loading, refetch } = useQuery(getAllAnnouncement, {
    variables: { limit: 5 },
  });
  const { data: blogsData, loading: blogsLoading, refetch: refetchBlogs } 
    = useQuery(GET_ALL_BLOGS);

      // Blog mutations
  const [createBlog, { loading: createBlogLoading }] = useMutation(CREATE_BLOG);
  const [updateBlog, { loading: updateBlogLoading }] = useMutation(UPDATE_BLOG);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const [publishBlog] = useMutation(PUBLISH_BLOG);


  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT, {
    onCompleted: () => {
      setNewAnnouncement("");
      setShowAnnouncementForm(false);
      refetch();
    }
  });

  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT, {
    onCompleted: () => {
      refetch();
    }
  });

  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT, {
    onCompleted: () => {
      setEditingAnnouncement(null);
      refetch();
    }
  });

  

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    try {
      await createAnnouncement({
        variables: { message: newAnnouncement }
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement({
          variables: { id }
        });
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement?.id || !editingAnnouncement.message.trim()) return;
  
    try {
      console.log('Sending update:', {
        id: editingAnnouncement.id,
        message: editingAnnouncement.message.trim()
      });
  
      const result = await updateAnnouncement({
        variables: {
          id: editingAnnouncement.id,
          message: editingAnnouncement.message.trim()
        },
        // Add error policy
        errorPolicy: 'all'
      });
  
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        return;
      }
  
      console.log('Update result:', result);
      setEditingAnnouncement(null);
      await refetch();
    } catch (error: any) {
      console.error('Update error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extraInfo: error.extraInfo
      });
    }
  };

  const toggleBlogForm = () => setShowBlogForm(!showBlogForm);

  // Blog handlers
  const handleCreateBlog = async (formData: BlogFormData, files: File[]) => {
    try {
      if (!files.length) {
        alert("Please select at least one image");
        return;
      }
  
      // Create proper Upload objects from Files
      const uploadFiles = files.map(file => {
        // Create a new blob from the file
        const blob = new Blob([file], { type: file.type });
        
        // Create a new File object with the blob
        return new File([blob], file.name, {
          type: file.type,
          lastModified: new Date().getTime()
        });
      });
  
      const input = {
        title: formData.title,
        body: formData.body,
        metaTags: formData.metaTags.split(",").map((tag) => tag.trim()),
        author: formData.author,
        published: false,
      };
  
      console.log("Creating blog with:", {
        input,
        filesCount: uploadFiles.length
      });
  
      const { data } = await createBlog({
        variables: {
          input,
          files: uploadFiles
        }
      });
  
      if (data?.createBlog) {
        alert("Blog created successfully!");
        setShowBlogForm(false);
        refetchBlogs();
      }
    } catch (error: any) {
      console.error("Error details:", {
        message: error.message,
        networkError: error.networkError?.result,
        graphQLErrors: error.graphQLErrors
      });
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
  try {
    await deleteBlog({
      variables: { id }
    });
    refetchBlogs();
  } catch (error) {
    console.error('Error deleting blog:', error);
    alert('Failed to delete blog');
  }
};

const handlePublishBlog = async (id: string) => {
  try {
    const { data } = await publishBlog({
      variables: { id }
    });
    if (data.publishBlog.url) {
      window.open(data.publishBlog.url, '_blank');
    }
    refetchBlogs();
  } catch (error) {
    console.error('Error publishing blog:', error);
    alert('Failed to publish blog');
  }
};

  return (
    <div className="bg-gray-50 min-h-screen lg:px-64">
    <header className="bg-cream px-6 py-8 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-700">Welcome Back,</h1>
        <h2 className="text-xl font-semibold text-green">
          {session?.user?.name || 'Admin'}
        </h2>
        <p className="text-sm text-gray-600">Role: {session?.user?.role}</p>
      </div>
      <div className="text-green">
        <button className="text-lg">
          <span role="img" aria-label="admin-icon">🛠️</span>
        </button>
      </div>
    </header>
      <section className="px-6 py-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Announcements</h3>
          <button 
            onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
            className="bg-green-500 text-black border-4 px-4 py-2 rounded"
          >
            {showAnnouncementForm ? "Close" : "Create Announcement"}
          </button>
        </div>

        {showAnnouncementForm && (
          <div className="mt-4 bg-white text-black p-6 rounded-lg shadow-lg">
            <form onSubmit={handleCreateAnnouncement}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter announcement message..."
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Post Announcement
              </button>
            </form>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {loading ? (
            <p>Loading announcements...</p>
          ) : (
            announcementData?.getAnnouncements?.map((announcement: Announcement) => (
              <div 
                key={announcement.id} 
                className="bg-white text-gray-400 p-4 rounded-lg shadow-sm"
              >
                {editingAnnouncement?.id === announcement.id ? (
                  <form onSubmit={handleUpdateAnnouncement} className="flex gap-2">
                    <input
                      type="text"
                      value={editingAnnouncement.message || ''}
                      onChange={(e) => {
                        if (editingAnnouncement) {
                          setEditingAnnouncement({
                            id: editingAnnouncement.id,
                            message: e.target.value
                          });
                        }
                      }}
                      className="flex-1 p-2 border rounded"
                    />
                    <button 
                      type="submit"
                      className="bg-green-500 text-black px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingAnnouncement(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">{announcement.message}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingAnnouncement({
                          id: announcement.id,
                          message: announcement.message
                        })}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 font-semibold">{order} - Pending</p>
              <div className="mt-2 flex justify-between text-sm">
                <Link href="/adminDashboard/orders">
                  <span className="text-newgreensecond hover:underline cursor-pointer">
                    View All Orders
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Control Panel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {controls.map((control, index) => (
            <div key={index} className="bg-cream p-4 rounded-lg shadow-sm">
              <h4 className="text-gray-700 font-semibold">{control}</h4>
              <p className="text-sm text-gray-600">Manage {control.toLowerCase()} settings.</p>
              <a href="#" className="text-newgreensecond hover:underline">
                Edit
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-8">
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold text-gray-700">Blogs</h3>
    <button
      onClick={() => {
        setEditingBlog(null);
        setShowBlogForm(!showBlogForm);
      }}
      className="bg-newgreensecond text-white px-4 py-2 rounded hover:bg-green-600"
    >
      {showBlogForm ? "Close Form" : "Create New Blog"}
    </button>
  </div>

  {showBlogForm && (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-lg text-black font-medium mb-4">
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
        loading={createBlogLoading || updateBlogLoading}
      />
    </div>
  )}

  <div className="mt-8">
    {blogsLoading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
      </div>
    ) : (
      <BlogList
        blogs={blogsData?.getAllBlogs || []}
        onPublish={handlePublishBlog}
        onDelete={handleDeleteBlog}
        onEdit={(blog) => {
          setEditingBlog(blog);
          setShowBlogForm(true);
        }}
      />
    )}
  </div>
</section>

      <section className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-700">Admin Account</h3>
        <ul className="mt-4 space-y-2">
          {["Manage Users", "Settings", "Sign Out"].map((item, index) => (
            <li key={index} className="text-newgreensecond hover:underline">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;