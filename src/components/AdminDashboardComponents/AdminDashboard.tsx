"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
import { getAllAnnouncement } from '@/constants/queries/getAllAnnouncementsQuery';

const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($message: String!) {
    createAnnouncement(message: $message) {
      id
      message
    }
  }
`;

const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: String!) {
    deleteAnnouncement(id: $id) {
      id
      message
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
  const orders = ["Order1", "Order2", "Order3"];
  const controls = ["Homepage Banner", "Product Listings", "Promotions"];
  const blogs = [
    { title: "New Arrivals", status: "Published" },
    { title: "Product Reviews", status: "Draft" },
    { title: "Company Updates", status: "Published" }
  ];

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState<EditingAnnouncement | null>(null);

  const { data: announcementData, loading, refetch } = useQuery(getAllAnnouncement, {
    variables: { limit: 5 },
  });

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

  return (
    <div className="bg-gray-50 min-h-screen lg:px-64">
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-700">Welcome Back,</h1>
          <h2 className="text-xl font-semibold text-green">Admin</h2>
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
        <h3 className="text-lg font-semibold text-gray-700">Blogs</h3>
        <button onClick={toggleBlogForm} className="bg-green-500 text-black border-4 px-4 py-2 rounded mt-4">
          {showBlogForm ? "Close Blog Form" : "Create New Blog"}
        </button>
        {showBlogForm && (
          <div className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg">
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Blog Title</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Main Image URL</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Blog Body</label>
                <textarea className="w-full p-2 border rounded" rows={6}></textarea>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">Image 1 URL</label>
                  <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Image 2 URL</label>
                  <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Image 3 URL</label>
                  <input type="text" className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Meta Tags (comma separated)</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Publish Blog
              </button>
            </form>
          </div>
        )}

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-700">Existing Blogs</h4>
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm mt-4">
              <h5 className="text-gray-700 font-medium">{blog.title}</h5>
              <p className="text-sm text-gray-600">Status: {blog.status}</p>
              <a href="#" className="text-newgreensecond hover:underline">
                Edit Blog
              </a>
            </div>
          ))}
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