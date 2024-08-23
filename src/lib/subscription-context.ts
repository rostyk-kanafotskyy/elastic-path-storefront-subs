import { createContext } from "react";
import { SubscriptionContextState } from "./types/product-types";

export const SubscriptionContext =
  createContext<SubscriptionContextState | null>(null);
