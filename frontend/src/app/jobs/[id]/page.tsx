import PageHeader from "@/components/PageHeader";
import { getJobById } from "@/lib/api";
import { Job } from "types";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { data: job } = await getJobById(id) as { data: Job };

  return (
    <>
      <PageHeader title="Job Detail" />
      <section className="text-gray-600 space-y-6">
        <div className="max-w-3xl mx-auto">
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
                <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 cursor-pointer">
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
    </>
  );
}
