import PageHeader from "@/components/PageHeader";
import { getJobById } from "@/lib/api";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { data: job } = await getJobById(id);

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

              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Duration:</span> {job.durationMinutes} minutes
                </p>
                <p>
                  <span className="font-medium">Assignment Type:</span> {job.assignmentType}
                </p>
                <p>
                  <span className="font-medium">City:</span> {job.city}
                </p>
                {job.status !== 'NEW' && (
                  <p>
                    <span className="font-medium">Pay Rate:</span> ${job.payRate} per audio minute
                  </p>
                )}
                {job.jobLink && (
                  <p>
                    <span className="font-medium">Job Link:</span>{" "}
                    <a
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open job
                    </a>
                  </p>
                )}
                {job.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {job.notes}
                  </p>
                )}
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(job.createdAt).toLocaleString()}
                </p>
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
