"use client";

import PageHeader from "@/components/PageHeader";

import { 
  getJobById, 
  getReporters, 
  assignReporter, 
  getEditors, 
  assignEditor, 
  updateJobStatus 
} from "@/lib/api";

import { Job, JobStatus, User } from "types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AssignReporterModal from "./components/AssignReporterModal";

const JOB_STATUS = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  TRANSCRIBED: 'TRANSCRIBED',
  REVIEWED: 'REVIEWED',
  COMPLETED: 'COMPLETED',
} as const;

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigningType, setAssigningType] = useState<'reporter' | 'editor'>('reporter');
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

  const handleOpenModal = async (type: 'reporter' | 'editor') => {
    setAssigningType(type);
    setIsModalOpen(true);
    try {
      let response;
      if (type === 'reporter') {
        response = await getReporters(job?.city);
      } else {
        response = await getEditors();
      }
      const usersData = Array.isArray(response) ? response : (response as any).data || [];
      setReporters(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error(`Failed to fetch ${type}s:`, error);
    }
  };

  const handleAssign = async () => {
    if (!selectedReporterId || !job) return;

    setIsAssigning(true);
    try {
      if (assigningType === 'reporter') {
        await assignReporter(params.id as string, selectedReporterId);
      } else {
        await assignEditor(params.id as string, selectedReporterId);
      }
      setIsModalOpen(false);
      setSelectedReporterId(null);
      // Refresh job data
      const response = await getJobById(params.id as string);
      setJob((response as any).data || response);
    } catch (error) {
      console.error(`Failed to assign ${assigningType}:`, error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateStatus = async (status: JobStatus) => {
    if (!job) return;

    setIsAssigning(true);
    try {
      await updateJobStatus(params.id as string, status);
      // Refresh job data
      const response = await getJobById(params.id as string);
      setJob((response as any).data || response);
    } catch (error) {
      console.error(`Failed to update status:`, error);
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
                  className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === JOB_STATUS.COMPLETED
                    ? 'bg-green-100 text-green-800'
                    : job.status === JOB_STATUS.NEW
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
                  <>
                  <p>
                    <span>Reporter:</span> 
                  </p>
                    <p>
                      <span className="font-medium">Reporter Pay Rate:</span> Rp {job.reporterRateApplied||0} per audio minute
                    </p>
                  </>
                )}
                {job.editorId && (
                  <>
                    <p>
                      <span className="font-medium">Editor Fee:</span> Rp {job.editorFeeApplied||0}
                    </p>
                  </>
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
                {job.status === JOB_STATUS.NEW && (
                  <div>
                    <button
                      onClick={() => handleOpenModal('reporter')}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                      Assign Reporter
                    </button>
                  </div>
                )}
                {job.status !== JOB_STATUS.NEW && !job.editorId && (
                  <div>
                    <button
                      onClick={() => handleOpenModal('editor')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                    >
                      Assign Editor
                    </button>
                  </div>
                )}
                <div>
                  {job.status === JOB_STATUS.ASSIGNED && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 cursor-pointer"
                      onClick={() => handleUpdateStatus(JOB_STATUS.TRANSCRIBED)}
                    >
                      Mark as {JOB_STATUS.TRANSCRIBED}
                    </button>
                  )}
                  {job.status === JOB_STATUS.TRANSCRIBED && job.editorId && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                      onClick={() => handleUpdateStatus(JOB_STATUS.REVIEWED)}
                    >
                      Mark as {JOB_STATUS.REVIEWED}
                    </button>
                  )}
                  {job.status === JOB_STATUS.REVIEWED && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                      onClick={() => handleUpdateStatus(JOB_STATUS.COMPLETED)}
                    >
                      Mark as {JOB_STATUS.COMPLETED}
                    </button>
                  )}
                </div>
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
          handleAssignReporter={handleAssign}
          isAssigning={isAssigning}
          title={assigningType === 'reporter' ? 'Assign Reporter' : 'Assign Editor'}
          type={assigningType}
        />
      )}
    </>
  );
}
