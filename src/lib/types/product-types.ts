import type { ProductResponse, File } from "@elasticpath/js-sdk";
import type { Dispatch, SetStateAction } from "react";
import { CartAddSubscriptionItemReq } from "@elasticpath/react-shopper-hooks";
import { SubscriptionContext } from "../cart-product-type-context";

export type IdentifiableBaseProduct = ProductResponse & {
  id: string;
  attributes: { slug: string; sku: string; base_product: true };
};

export interface ProductContextState {
  isChangingSku: boolean;
  setIsChangingSku: Dispatch<SetStateAction<boolean>>;
}

export interface ProductModalContextState {
  isChangingSku: boolean;
  setIsChangingSku: Dispatch<SetStateAction<boolean>>;
  changedSkuId: string;
  setChangedSkuId: Dispatch<SetStateAction<string>>;
}

export interface OptionDict {
  [key: string]: string;
}

export interface ProductResponseWithImage extends ProductResponse {
  main_image?: File;
}

export interface ProductImageObject {
  [key: string]: File;
}

export interface CartProductTypeContext {
  isChangingSku: boolean;
  setIsChangingSku: Dispatch<SetStateAction<boolean>>;
}

export interface SubscriptionContextState {
  offeringId?: string;
  planId?: string;
  setOfferingId: Dispatch<SetStateAction<string>>;
  setPlanId: Dispatch<SetStateAction<string>>;
}
