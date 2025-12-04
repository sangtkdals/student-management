import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Post } from "../types";
import { Card } from "./ui";

interface AnnouncementDetailProps {
  setIsLoading: (isLoading: boolean) => void;
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ setIsLoading }) => {
  const [announcement, setAnnouncement] = useState<Post | null>(null);
  const [announcements, setAnnouncements] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

  useEffect(() => {
    if (id) {
      const fetchPostDetail = async () => {
        setIsLoading(true);
        try {
          const detailRes = await axios.get(`/api/announcements/${id}`);
          const post = detailRes.data;
          const fetchedPost: Post = {
            postId: post.postId,
            title: post.postTitle,
            content: post.postContent,
            createdAt: post.createdAt,
            writerName: post.writerName || '알 수 없음',
            boardId: 0, // boardId is not returned from backend
            writerId: post.writerNo,
            viewCount: post.viewCount,
          };
          setAnnouncement(fetchedPost);
        } catch (error) {
          console.error("Error fetching post detail:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPostDetail();
    }
  }, [id, setIsLoading]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const listRes = await axios.get(`/api/announcements?page=${currentPage - 1}&size=${postsPerPage}`);
        const { content, totalPages: fetchedTotalPages } = listRes.data;

        const fetchedPosts = content.map(
          (post: any): Post => ({
            postId: post.postId,
            title: post.postTitle,
            content: post.postContent,
            createdAt: post.createdAt,
            writerName: post.writerName || '알 수 없음',
            boardId: 0, // boardId is not returned from backend
            writerId: post.writerNo,
            viewCount: post.viewCount,
          })
        );
        setAnnouncements(fetchedPosts);
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [currentPage]);

  if (!announcement) {
    return null;
  }

  // Pagination logic
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      navigate(`/announcements/${id}?page=${pageNumber}`);
    }
  };

  return (
    <div className="space-y-8">
      <Card title={announcement.title}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <p className="text-sm text-slate-500">게시자: {announcement.writerName}</p>
            <p className="text-sm text-slate-500">작성일: {new Date(announcement.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="prose max-w-none min-h-[200px]">
            <p>{announcement.content}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 w-20">
                  번호
                </th>
                <th scope="col" className="px-6 py-3">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 w-32">
                  작성자
                </th>
                <th scope="col" className="px-6 py-3 w-40">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((post) => (
                <tr
                  key={post.postId}
                  className={`border-b ${post.postId === parseInt(id!, 10) ? "bg-blue-100 hover:bg-blue-200" : "bg-white hover:bg-slate-50"}`}
                >
                  <td className="px-6 py-4">{post.postId}</td>
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    <Link to={`/announcements/${post.postId}?page=${currentPage}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{post.writerName}</td>
                  <td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center p-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-white border rounded disabled:opacity-50"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 mx-1 border rounded ${currentPage === number ? "bg-brand-blue text-white" : "bg-white"}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-white border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AnnouncementDetail;
