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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(0, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages);

    if (currentPage < halfMaxPages) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    }

    if (currentPage > totalPages - 1 - halfMaxPages) {
      startPage = Math.max(0, totalPages - maxPagesToShow);
    }

    // Previous Button
    pageNumbers.push(
      <Button key="prev" onClick={() => handlePageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="mx-1">
        {"<"}
      </Button>
    );

    // First Page and Ellipsis
    if (startPage > 0) {
      pageNumbers.push(
        <Button key={0} variant="secondary" onClick={() => handlePageChange(0)} className="mx-1">
          {1}
        </Button>
      );
      if (startPage > 1) {
        pageNumbers.push(
          <span key="start-ellipsis" className="self-end px-1">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button key={i} variant={currentPage === i ? "primary" : "secondary"} onClick={() => handlePageChange(i)} className="mx-1">
          {i + 1}
        </Button>
      );
    }

    // Last Page and Ellipsis
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pageNumbers.push(
          <span key="end-ellipsis" className="self-end px-1">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <Button key={totalPages - 1} variant="secondary" onClick={() => handlePageChange(totalPages - 1)} className="mx-1">
          {totalPages}
        </Button>
      );
    }

    // Next Button
    pageNumbers.push(
      <Button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="mx-1"
      >
        {">"}
      </Button>
    );

    return pageNumbers;
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
      <div className="flex justify-center mt-4">{renderPagination()}</div>
    </Card>
  );
};
