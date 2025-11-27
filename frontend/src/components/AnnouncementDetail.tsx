import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import type { Post } from "../types";
import { Card } from "./ui";

const AnnouncementDetail: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Post | null>(null);
  const [otherAnnouncements, setOtherAnnouncements] = useState<Post[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // Fetch the specific announcement
      axios
        .get(`/api/announcements/${id}`)
        .then((response) => {
          const post = response.data;
          const fetchedPost: Post = {
            postId: post.postId,
            title: post.postTitle,
            content: post.postContent,
            createdAt: post.createdAt,
            writerName: post.writer.mName,
            boardId: post.board.boardId,
            writerId: post.writer.mNo,
            viewCount: post.viewCount,
          };
          setAnnouncement(fetchedPost);
        })
        .catch((error) => console.error("Error fetching announcement:", error));

      // Fetch all announcements for the list
      axios
        .get("/api/announcements")
        .then((response) => {
          const allPosts = response.data.map(
            (post: any): Post => ({
              postId: post.postId,
              title: post.postTitle,
              content: post.postContent,
              createdAt: post.createdAt,
              writerName: post.writer.mName,
              boardId: post.board.boardId,
              writerId: post.writer.mNo,
              viewCount: post.viewCount,
            })
          );
          // Filter out the current announcement
          setOtherAnnouncements(allPosts.filter((p: Post) => p.postId !== parseInt(id, 10)));
        })
        .catch((error) => console.error("Error fetching other announcements:", error));
    }
  }, [id]);

  if (!announcement) {
    return <div>로딩 중...</div>;
  }

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

      <Card title="다른 공지사항">
        <ul className="divide-y">
          {otherAnnouncements.map((ann) => (
            <li key={ann.postId} className="hover:bg-slate-50 transition-colors">
              <Link to={`/announcements/${ann.postId}`} className="flex justify-between items-center p-4">
                <span className="text-slate-800">{ann.title}</span>
                <span className="text-sm text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default AnnouncementDetail;
