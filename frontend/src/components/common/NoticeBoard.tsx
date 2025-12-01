import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../types";
import { Card, Button } from "../ui";
import axios from "axios";

export const NoticeBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/announcements?page=${currentPage}&size=10`)
      .then((response) => {
        const data = response.data.content ? response.data.content : response.data;
        const posts = data.map((post: any) => ({
          postId: post.postId,
          title: post.postTitle,
          content: post.postContent,
          createdAt: post.createdAt,
          writerName: post.writer.mName,
        }));
        setAnnouncements(posts);
        setTotalPages(response.data.totalPages || 1);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card title="공지사항">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                제목
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                작성자
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                작성일자
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {announcements.map((ann) => (
              <tr key={ann.postId} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ann.postId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  <Link to={`/announcements/${ann.postId}`} className="hover:text-brand-blue">
                    {ann.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ann.writerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <Button key={page} variant={currentPage === page ? "primary" : "secondary"} onClick={() => handlePageChange(page)} className="mx-1">
              {page + 1}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
