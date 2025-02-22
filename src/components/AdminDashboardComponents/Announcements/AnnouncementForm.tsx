// components/AdminDashboard/Announcements/AnnouncementForm.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ANNOUNCEMENT } from '@/constants/mutations/announcementMutations';

interface AnnouncementFormProps {
  onSuccess: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSuccess }) => {
  const [message, setMessage] = useState("");

  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT, {
    onCompleted: () => {
      setMessage("");
      onSuccess();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await createAnnouncement({
        variables: { message }
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <div className="mt-4 bg-white text-black p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Announcement Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter announcement message..."
          />
        </div>
        <button 
          type="submit"
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default AnnouncementForm;

