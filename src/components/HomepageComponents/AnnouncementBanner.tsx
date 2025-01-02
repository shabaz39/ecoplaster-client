"use client"
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getAllAnnouncement } from '@/constants/queries/getAllAnnouncementsQuery';

interface Announcement {
  id: string;
  message: string;
}

const AnnouncementBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data, loading, error } = useQuery(getAllAnnouncement, {
    variables: { limit: 3 },
    fetchPolicy: 'cache-first',
    // Add these options to help debug
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('Query completed:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Debug log every state change
  useEffect(() => {
    console.log('Current state:', {
      loading,
      error: error?.message,
      data,
      networkStatus: data?.networkStatus
    });
  }, [loading, error, data]);

  const fallbackAnnouncements = [
    "🎉 Big Announcement: EcoPlaster is now available nationwide!",
    "💡 Special Offer: Get 20% off on your first order with code ECO20!",
    "📢 Join Our Dealer Program and grow your business with EcoPlaster."
  ];

  const announcements = data?.getAnnouncements?.map(
    (announcement: Announcement) => announcement.message
  ) || (loading ? [] : fallbackAnnouncements);

  // Handle rotation
  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  // If loading for more than 5 seconds, show fallback
  useEffect(() => {
    if (!loading) return;
    
    const timeout = setTimeout(() => {
      console.log('Loading timeout reached, showing fallback');
      return fallbackAnnouncements;
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (error) {
    console.error('Error fetching announcements:', error);
    return (
      <div className="bg-black text-white w-full">
        <div className="h-10 flex items-center justify-center">
          {fallbackAnnouncements.map((announcement: string, index: number) => (
            <div
              key={index}
              className={`absolute w-full text-center transition-all duration-500 ease-in-out px-4 py-2
                ${index === currentIndex ? "top-0 opacity-100" : "top-10 opacity-0"}`}
            >
              <p className="text-sm md:text-base truncate">{announcement}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no announcements
  if (!loading && announcements.length === 0) return null;

  return (
    <div className="bg-black text-white w-full overflow-hidden">
      <div className="h-10 relative">
        {(loading ? [] : announcements).map((announcement: string, index: number) => (
          <div
            key={index}
            className={`absolute w-full text-center transition-all duration-500 ease-in-out px-4 py-2
              ${index === currentIndex 
                ? "top-0 opacity-100" 
                : "top-10 opacity-0"
              }`}
          >
            <p className="text-sm md:text-base truncate">
              {announcement}
            </p>
          </div>
        ))}
        {loading && (
          <div className="h-10 flex items-center justify-center">
            <p className="text-sm">Loading announcements...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBanner;