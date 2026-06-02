import { User } from "types";

export default function AssignReporterModal({
  selectedReporterId, 
  setSelectedReporterId,
  reporters,
  setIsModalOpen,
  handleAssignReporter,
  isAssigning,
}: { 
  selectedReporterId: number | null, 
  setSelectedReporterId: (id: number | null) => void,
  reporters: User[],
  setIsModalOpen: (open: boolean) => void,
  handleAssignReporter: () => void,
  isAssigning: boolean,
}) {
  return (
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
  )
}