import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Input } from "../ui";
import type { Post } from "../../types";

export const AdminNoticeManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ title: string; content: string }>({
    title: "",
    content: ""
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/announcements");
      // 응답 데이터가 Page 객체이므로 content 속성에 접근합니다.
      const mappedPosts = response.data.content.map((post: any) => ({
        postId: post.postId,
        title: post.postTitle,
        content: post.postContent,
        createdAt: post.createdAt,
        writerName: post.writer.mName,
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.postId);
    setFormData({
      title: post.title || "", // null 값 방지
      content: post.content || "" // null 값 방지
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (editingId) {
        await axios.put(`/api/announcements/${editingId}`, {
          title: formData.title,
          content: formData.content
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("공지사항이 수정되었습니다.");
      } else {
        await axios.post("/api/announcements", {
          title: formData.title,
          content: formData.content
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("공지사항이 등록되었습니다.");
      }
      fetchPosts();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("저장 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/announcements/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPosts();
        alert("삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("삭제 실패");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card title="공지사항 관리">
        <div className="mb-4 flex justify-end">
          <Button onClick={handleAdd}>공지사항 작성</Button>
        </div>

        <Table headers={["제목", "작성일", "작성자", "관리"]}>
          {posts.map((post) => (
            <tr key={post.postId}>
              <td className="px-6 py-4 text-sm font-medium">{post.title}</td>
              <td className="px-6 py-4 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">{post.writerName}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(post)}>수정</Button>
                  <Button variant="secondary" onClick={() => handleDelete(post.postId)}>
                    삭제
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[600px]">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "공지사항 수정" : "공지사항 작성"}
              </h3>

              <Input
                label="제목"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  내용
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
                <Button onClick={handleSave}>등록</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
