"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createJobAction } from "@/lib/actions";
import { useActionState } from "react";

export default function CreateJobPage() {
  const [state, formAction] = useActionState(createJobAction, {
    error: undefined,
    data: {
      caseName: "",
      durationMinutes: 10,
      assignmentType: "PHYSICAL",
      city: "",
    },
  });

  return (
    <>
      <PageHeader title="Create Job" />
      <section className="text-gray-600 space-y-6">
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {state.error}
          </div>
        )}
        <form className="space-y-6" action={formAction}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Case Name
              </label>
              <input
                type="text"
                name="caseName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={state.data.caseName}
                placeholder="Case Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (Minutes)
              </label>
              <input
                type="number"
                name="durationMinutes"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={state.data.durationMinutes}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assignment Type
              </label>
              <select
                name="assignmentType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={state.data.assignmentType}
              >
                <option value="PHYSICAL">Physical</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City (Optional)
              </label>
              <input
                type="text"
                name="city"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={state.data.city}
                placeholder="City"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Create Job
            </button>
            <Link
              href="/jobs"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
