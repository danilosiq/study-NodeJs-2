import { randomUUID } from "crypto";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { db } from "../database.js";
import { checkSessionIdExist } from "../middleware/check-session-id-exists.js";

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler',async ()=>{
        console.log(``);
        
    })
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExist],
    },
    async (req, reply) => {
      const { sessionId } = req.cookies;

      const transactions = await db("transactions")
        .where("session_id", sessionId)
        .select();
      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExist],
    },
    async (req) => {
      const getTransactionParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(req.params);
      const { sessionId } = req.cookies;
      const transaction = await db("transactions")
        .where({
          session_id: sessionId,
          id,
        })
        .first();
      return { transaction };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExist],
    },
    async (req) => {
      const { sessionId } = req.cookies;
      const summary = await db("transactions")
        .sum("amount", { as: "amount" })
        .where("session_id", sessionId)
        .first();
      return { summary };
    }
  );

  app.post(
    "/",
    async (req, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });

      const { amount, title, type } = createTransactionBodySchema.parse(
        req.body
      );

      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, //7 days
        });
      }

      await db("transactions").insert({
        id: crypto.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId,
      });

      return reply.status(201).send();
    }
  );
}
