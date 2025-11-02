import React, { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  Mail,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { getAllFeedback, deleteFeedback } from "../../services/adminApi";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa đánh giá này?")) return;
    setDeletingId(id);
    try {
      await deleteFeedback(id);
      setFeedbacks(feedbacks.filter((f) => f.feedbackId !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Không thể xóa đánh giá");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Đánh Giá</h1>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.feedbackId} className="bg-white p-4 rounded border">
            <div className="flex justify-between">
              <div className="flex-1">
                <p className="font-semibold">
                  {fb.userFullName || fb.username}
                </p>
                <p className="text-sm text-gray-600">{fb.userEmail}</p>
                <div className="flex gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= fb.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700">{fb.comment}</p>
              </div>
              <button
                onClick={() => handleDelete(fb.feedbackId)}
                disabled={deletingId === fb.feedbackId}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackManagement;
