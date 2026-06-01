export const createJobSchema = {
  body: {
    type: "object",
    required: ["caseName", "durationMinutes", "assignmentType"],
    properties: {
      caseName: { type: "string", minLength: 1, maxLength: 255 },
      durationMinutes: { type: "integer", minimum: 1 },
      assignmentType: { type: "string", enum: ["PHYSICAL", "REMOTE"] },
      city: { type: "string", minLength: 1, maxLength: 100 },
      status: {
        type: "string",
        enum: ["NEW", "ASSIGNED", "TRANSCRIBED", "REVIEWED", "COMPLETED"],
      },
      reporterId: { type: "integer" },
      editorId: { type: "integer" },
      reporterRateApplied: { type: "string" },
      editorFeeApplied: { type: "string" },
      totalPayout: { type: "string" },
    },
    additionalProperties: false,
  },
}