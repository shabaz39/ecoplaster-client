import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_ANNOUNCEMENTS, 
  DELETE_ANNOUNCEMENT, 
  UPDATE_ANNOUNCEMENT 
} from '@/constants/mutations/announcementMutations';
import LoadingSpinner from '../Common/LoadingSpinner';
import AnnouncementForm from './AnnouncementForm';

interface Announcement {
  id: string;
  message: string;
  createdAt: string;
  active: boolean;
}

interface EditingAnnouncement {
  id: string;
  message: string;
}

const AnnouncementList = () => {
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<EditingAnnouncement | null>(null);

  const { data: announcementData, loading, refetch } = useQuery(GET_ALL_ANNOUNCEMENTS, {
    variables: { limit: 5 },
  });

  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT, {
    onCompleted: refetch,
    onError: (error) => {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  });

  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT, {
    onCompleted: () => {
      setEditingAnnouncement(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement');
    }
  });

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
      await updateAnnouncement({
        variables: {
          id: editingAnnouncement.id,
          message: editingAnnouncement.message.trim()
        }
      });
    } catch (error: any) {
      console.error('Update error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-productNameColor">Announcements</h3>
        <button 
          onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          {showAnnouncementForm ? "Close" : "Create Announcement"}
        </button>
      </div>

      {showAnnouncementForm && (
        <AnnouncementForm onSuccess={() => {
          setShowAnnouncementForm(false);
          refetch();
        }} />
      )}

      <div className="space-y-4">
        {announcementData?.getAnnouncements?.map((announcement: Announcement) => (
          <div 
            key={announcement.id} 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {editingAnnouncement?.id === announcement.id ? (
              <form onSubmit={handleUpdateAnnouncement} className="flex gap-2">
                <input
                  type="text"
                  value={editingAnnouncement.message}
                  onChange={(e) => setEditingAnnouncement({
                    id: editingAnnouncement.id,
                    message: e.target.value
                  })}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
                />
                <button 
                  type="submit"
                  className="bg-greenComponent text-white px-3 py-1 rounded hover:bg-newgreen transition-colors"
                >
                  Save
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-gray-700 flex-1 mr-4">{announcement.message}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingAnnouncement({
                      id: announcement.id,
                      message: announcement.message
                    })}
                    className="text-greenComponent hover:text-newgreen transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {(!announcementData?.getAnnouncements || announcementData.getAnnouncements.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No announcements found.
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementList;