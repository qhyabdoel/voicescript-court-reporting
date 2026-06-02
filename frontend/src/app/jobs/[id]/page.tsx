"use client";

import PageHeader from "@/components/PageHeader";
import { getJobById, getReporters, assignReporter } from "@/lib/api";
import { Job } from "types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Reporter {
  id: number;
  name: string;
  city: string;
  isAvailable: boolean;
  basePayRate: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reporters, setReporters] = useState<Reporter[]>([]);
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
      <section className="text-gray-600 space-y-6">
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

              <div>
                <button 
                  onClick={handleOpenModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Assign Reporter
                </button>
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
        <div className="fixed inset-0 bg-black/50 flex justify-center pt-32 z-50 text-gray-800">
          <div className="bg-white rounded-lg p-6 w-full max-w-md h-fit">
            <h3 className="text-lg font-semibold mb-4">Assign Reporter</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Reporter
              </label>
              <select
                value={selectedReporterId || ""}
                onChange={(e) => setSelectedReporterId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a reporter</option>
                {reporters.map((reporter) => (
                  <option key={reporter.id} value={reporter.id}>
                    {reporter.name} - {reporter.city} (Rp {reporter.basePayRate}/min)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReporterId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignReporter}
                disabled={!selectedReporterId || isAssigning}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAssigning ? "Assigning..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
