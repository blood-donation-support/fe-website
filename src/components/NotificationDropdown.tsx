import React, { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Hook to navigate
import dayjs from "dayjs";
import { fetchNotiList, markAllNotiRead, markNotiRead } from "@/redux/slices/notificationSlice";
import type { AppDispatch } from "@/redux/store";

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Hook to navigate to history page

  const dispatch = useDispatch<AppDispatch>();
  const { list: notifications, loading } = useSelector((state: any) => state.notification);

  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchNotiList());
    }, 10000); // 10 giây kiểm tra 1 lần

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    dispatch(markAllNotiRead()).then(() => {
      dispatch(fetchNotiList()); 
      setOpen(false);
    });
  };

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      dispatch(markNotiRead(notification._id));
    }
    navigate(`/profile/blood-history/${notification.donation_registration_id}`); // Navigate to BloodHistoryPage
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition relative"
        title="Thông báo"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-4 px-4 w-[35rem] max-h-[30rem] overflow-y-auto">
          <div className="font-bold text-lg mb-2 flex justify-between items-center">
            Thông báo
            {notifications.length > 0 && (
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={handleMarkAllRead}
              >
                Đánh dấu đã đọc hết
              </button>
            )}
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-6">Đang tải...</div>
          ) : (
            <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="text-gray-400 text-center py-6">Không có thông báo</li>
              ) : (
                [...notifications]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sắp xếp mới nhất lên đầu
                  .map((item: any) => (
                    <li
                      key={item._id}
                      className={`p-3 rounded-md hover:bg-blue-50 cursor-pointer flex items-center justify-between ${item.is_read ? "" : "bg-blue-50"}`}
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm">{item.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {dayjs(item.created_at).format("HH:mm DD/MM/YYYY")}
                        </div>
                      </div>
                      {!item.is_read && (
                        <span className="ml-2 w-3 h-3 rounded-full bg-blue-500"></span>
                      )}
                    </li>
                  ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
