"use client";

import PageHeader from "@/components/PageHeader";
import { getJobById, getReporters, assignReporter } from "@/lib/api";
import { Job, User } from "types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AssignReporterModal from "./components/AssignReporterModal";

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reporters, setReporters] = useState<User[]>([]);
  const [selectedReporterId, setSelectedReporterId] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await getJobById(params.id as string);
        setJob((response as any).data || response);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [params.id]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    try {
      const response = await getReporters(job?.city);
      const reportersData = Array.isArray(response) ? response : (response as any).data || [];
      setReporters(Array.isArray(reportersData) ? reportersData : []);
    } catch (error) {
      console.error("Failed to fetch reporters:", error);
    }
  };

  const handleAssignReporter = async () => {
    if (!selectedReporterId || !job) return;
    
    setIsAssigning(true);
    try {
      await assignReporter(params.id as string, selectedReporterId);
      setIsModalOpen(false);
      setSelectedReporterId(null);
      // Refresh job data
      const response = await getJobById(params.id as string);
      setJob((response as any).data || response);
    } catch (error) {
      console.error("Failed to assign reporter:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <PageHeader title="Job Detail" />
      <section className="text-gray-600 space-y-4">
        <div className="">
          <Link
            href="/jobs"
            className="inline-flex items-center text-blue-500 hover:text-blue-600"
          >
            ← Back to Job List
          </Link>
        </div>
        <div className="max-w-3xl">
          {job ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {job.caseName}
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : job.status === 'NEW'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Duration:</span> {job.durationMinutes} minutes
                </p>
                <p>
                  <span className="font-medium">Assignment Type:</span> {job.assignmentType}
                </p>
                <p>
                  <span className="font-medium">City:</span> {job.city}
                </p>
                {job.reporterRateApplied && (
                  <p>
                    <span className="font-medium">Reporter Pay Rate:</span> Rp {job.reporterRateApplied||0} per audio minute
                  </p>
                )}
                {job.editorId && (
                  <p>
                    <span className="font-medium">Editor Fee:</span> Rp {job.editorFeeApplied||0}
                  </p>
                )}
                {job.totalPayout && (
                  <p>
                    <span className="font-medium">Total Pay:</span> Rp {job.totalPayout||0}
                  </p>
                )}
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div className="space-y-3">
                {job.status === 'NEW' && (
                  <div>
                    <button 
                      onClick={handleOpenModal}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                      Assign Reporter
                    </button>
                  </div>
                )}
                {job.status !== 'NEW' && !job.editorId && (
                  <div>
                    <button 
                      onClick={handleOpenModal}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                    >
                      Assign Editor
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No job found with this ID</p>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <AssignReporterModal
          selectedReporterId={selectedReporterId}
          setSelectedReporterId={setSelectedReporterId}
          reporters={reporters}
          setIsModalOpen={setIsModalOpen}
          handleAssignReporter={handleAssignReporter}
          isAssigning={isAssigning}
        />
      )}
    </>
  );
}
