import React, { useState, useEffect } from "react";
import { App, Modal } from "antd";
import { messageHelper } from "../../utils/messageHelper";
import {
  Star,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  Calendar,
} from "lucide-react";
import {
  getMyFeedback,
  createFeedback,
  updateMyFeedback,
  deleteMyFeedback,
} from "../../services/feedbackApi";

const MyFeedback = () => {
  const { message } = App.useApp();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ comment: "", rating: 5 });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await getMyFeedback();
      // API returns an array, get the first item
      const feedbackItem =
        Array.isArray(data) && data.length > 0 ? data[0] : null;
      setFeedback(feedbackItem);
      if (feedbackItem) {
        setFormData({
          comment: feedbackItem.comment,
          rating: feedbackItem.rating,
        });
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      messageHelper.warning(message, "Vui lòng nhập nhận xét");
      return;
    }
    setSubmitting(true);
    try {
      if (feedback) {
        await updateMyFeedback(feedback.feedbackId, formData);
        messageHelper.success(message, "Đã cập nhật đánh giá");
      } else {
        await createFeedback(formData);
        messageHelper.success(message, "Đã tạo đánh giá mới");
      }
      setEditing(false);
      fetchFeedback();
    } catch (err) {
      console.error("Error saving feedback:", err);
      const errorMsg = err?.response?.data?.message || "Không thể lưu đánh giá";
      const statusCode = err?.response?.status;
      messageHelper.error(
        message,
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Xóa đánh giá",
      content: "Bạn có chắc chắn muốn xóa đánh giá của mình?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMyFeedback(feedback.feedbackId);
          setFeedback(null);
          setFormData({ comment: "", rating: 5 });
          messageHelper.success(message, "Đã xóa đánh giá");
        } catch (err) {
          console.error("Error deleting feedback:", err);
          const errorMsg =
            err?.response?.data?.message || "Không thể xóa đánh giá";
          const statusCode = err?.response?.status;
          messageHelper.error(
            message,
            `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
          );
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đánh Giá Của Tôi
        </h1>
        <p className="text-gray-600">
          Chia sẻ trải nghiệm của bạn về nền tảng EcoWrap
        </p>
      </div>

      {!feedback && !editing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có đánh giá
          </h3>
          <p className="text-gray-600 mb-6">
            Hãy chia sẻ trải nghiệm của bạn với chúng tôi
          </p>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} /> Tạo đánh giá mới
          </button>
        </div>
      )}

      {feedback && !editing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Đánh giá của bạn
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={24}
                        className={
                          s <= feedback.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ({feedback.rating}/5)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {feedback.comment}
            </p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Calendar size={16} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                Đã gửi vào{" "}
                {new Date(feedback.feedbackDate).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {feedback ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: s })}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  >
                    <Star
                      size={32}
                      className={
                        s <= formData.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-gray-400"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {formData.rating}/5
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét của bạn <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="6"
                placeholder="Chia sẻ trải nghiệm của bạn về nền tảng EcoWrap..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Tối thiểu 10 ký tự, tối đa 1000 ký tự ({formData.comment.length}
                /1000)
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Đang lưu..."
                  : feedback
                  ? "Cập nhật đánh giá"
                  : "Gửi đánh giá"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  if (feedback) {
                    setFormData({
                      comment: feedback.comment,
                      rating: feedback.rating,
                    });
                  }
                }}
                disabled={submitting}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyFeedback;
