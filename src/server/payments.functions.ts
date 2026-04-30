import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPixOrder, getOrderPayment } from "./payments.server";

export const createPix = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    customer_name: z.string().min(3),
    customer_cpf: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    return createPixOrder(data);
  });

export const getOrderData = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({
    orderId: z.string().uuid()
  }).parse(data))
  .handler(async ({ data }) => {
    return getOrderPayment(data.orderId);
  });