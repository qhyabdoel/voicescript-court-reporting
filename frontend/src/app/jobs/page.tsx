"use client";

import PageHeader from "@/components/PageHeader";
import { getJobs } from "@/lib/api";
import { Job } from "types";
import Link from "next/link";
import { useState, useEffect } from "react";

interface JobsResponse {
  data: Job[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getJobs(
          pagination.limit,
          pagination.offset,
        );
        const jobsData = response.data?.data || response.data;
        const paginationData = response.data?.pagination || response.pagination;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setPagination(paginationData || {
          limit: pagination.limit,
          offset: pagination.offset,
          total: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [pagination.offset, pagination.limit]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPagination((prev) => ({
        ...prev,
        offset: Math.max(prev.offset - prev.limit, 0),
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0,
    }));
  };

  return (
    <>
      <PageHeader title="Job List" />
      <section className="text-gray-600 space-y-6">
        <div>
          <Link
            href="/jobs/create"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Job
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {pagination.offset + 1} to{" "}
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
            of {pagination.total} jobs
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Items per page:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p>No jobs found</p>
          </div>
        ) : (
          <>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Case Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Duration
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Assignment Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    City
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: Job) => (
                  <tr key={job.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.caseName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.durationMinutes} Minutes
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.assignmentType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.city || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Previous
              </button>

              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
