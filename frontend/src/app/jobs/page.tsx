import PageHeader from "@/components/PageHeader";
import { getJobs } from "../lib/api";
import { Job } from "types";
import Link from "next/link";

export default async function JobsPage() {
  const { data: jobs } = await getJobs();

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
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Case Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.data.map((job: Job) => (
              <tr key={job.id}>
                <td className="border border-gray-300 px-4 py-2">{job.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.caseName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
