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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <XCircle className="text-red-500 mx-auto mb-3" size={48} />
          <h3 className="text-red-800 font-medium text-center mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          <button
            onClick={fetchFeedbacks}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản Lý Đánh Giá
              </h1>
              <p className="text-gray-600">
                Quản lý tất cả đánh giá của người dùng về nền tảng
              </p>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <CheckCircle size={18} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbacks.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating}/5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người dùng đã đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(feedbacks.map((f) => f.userId)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh Sách Đánh Giá
            </h2>
          </div>

          {feedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đánh giá nào
              </h3>
              <p className="text-gray-600">
                Khi có người dùng gửi đánh giá, chúng sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedbacks.map((fb) => (
                <div
                  key={fb.feedbackId}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={24} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {fb.userFullName ||
                              fb.username ||
                              "Người dùng ẩn danh"}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              {fb.userEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(fb.feedbackDate)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={18}
                              className={
                                s <= fb.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          ({fb.rating}/5)
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {fb.comment}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(fb.feedbackId)}
                      disabled={deletingId === fb.feedbackId}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xóa đánh giá"
                    >
                      {deletingId === fb.feedbackId ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
