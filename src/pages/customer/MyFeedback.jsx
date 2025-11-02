import React, { useState, useEffect } from "react";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import {
  getMyFeedback,
  createFeedback,
  updateMyFeedback,
  deleteMyFeedback,
} from "../../services/feedbackApi";

const MyFeedback = () => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ comment: "", rating: 5 });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await getMyFeedback();
      setFeedback(data);
      if (data) {
        setFormData({ comment: data.comment, rating: data.rating });
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
    try {
      if (feedback) {
        await updateMyFeedback(feedback.feedbackId, formData);
      } else {
        await createFeedback(formData);
      }
      setEditing(false);
      fetchFeedback();
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Không thể lưu đánh giá");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Xóa đánh giá của bạn?")) return;
    try {
      await deleteMyFeedback(feedback.feedbackId);
      setFeedback(null);
      setFormData({ comment: "", rating: 5 });
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Không thể xóa đánh giá");
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đánh Giá Của Tôi</h1>

      {!feedback && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus size={20} /> Tạo đánh giá mới
        </button>
      )}

      {feedback && !editing && (
        <div className="bg-white p-6 rounded border">
          <div className="flex justify-between mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={
                    s <= feedback.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <p className="text-gray-700">{feedback.comment}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(feedback.feedbackDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded border space-y-4"
        >
          <div>
            <label className="block mb-2 font-medium">Đánh giá</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: s })}
                >
                  <Star
                    size={24}
                    className={
                      s <= formData.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">Nhận xét</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full border rounded p-2"
              rows="4"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyFeedback;
