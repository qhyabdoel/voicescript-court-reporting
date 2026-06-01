import { FastifyReply, FastifyRequest } from "fastify";

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  message: string,
  statusCode = 200
) {
  return reply.status(statusCode).send({ success: true, message, data });
}

export function sendError(
  reply: FastifyReply,
  request: FastifyRequest,
  error: unknown,
  message: string,
  statusCode = 500
) {
  request.log.error(error);
  return reply.status(statusCode).send({
    success: false,
    message,
    error: error instanceof Error ? error.message : "Unknown error",
  });
}
