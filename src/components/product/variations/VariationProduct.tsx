"use client";
import {
  useCartAddProduct,
  useVariationProduct,
  VariationProduct,
  VariationProductProvider,
  useCartAddSubscriptionItem,
} from "@elasticpath/react-shopper-hooks";
import ProductVariations from "./ProductVariations";
import ProductCarousel from "../carousel/ProductCarousel";
import ProductSummary from "../ProductSummary";
import ProductDetails from "../ProductDetails";
import ProductExtensions from "../ProductExtensions";
import { StatusButton } from "../../button/StatusButton";
import ProductSubscriptions from "../subscriptions/ProductSubscribtion";
import { useCallback, useContext } from "react";
import { SubscriptionContext } from "../../../lib/subscription-context";
import {
  FormSelectedOptions,
  formSelectedOptionsToData,
} from "../bundles/form-parsers";

export const VariationProductDetail = ({
  variationProduct,
}: {
  variationProduct: VariationProduct;
}): JSX.Element => {
  return (
    <VariationProductProvider variationProduct={variationProduct}>
      <VariationProductContainer />
    </VariationProductProvider>
  );
};

export function VariationProductContainer(): JSX.Element {
  const { product } = useVariationProduct();
  const { mutate: mutateProduct, isPending: isPendingProduct } =
    useCartAddProduct();
  const { mutate: mutateSubs, isPending: isPendingSubs } =
    useCartAddSubscriptionItem();

  const isPending = isPendingProduct || isPendingSubs;
  const { planId, offeringId } = useContext(SubscriptionContext);

  const { response, main_image, otherImages } = product;
  const { extensions } = response.attributes;

  const handleAddToCart = useCallback(async () => {
    if (offeringId && planId) {
      mutateSubs({
        id: offeringId,
        subscription_configuration: {
          plan: planId,
        },
        quantity: 1,
      });
    } else {
      mutateProduct({ productId: response.id, quantity: 1 });
    }
  }, [response.id, mutateProduct, mutateSubs, offeringId, planId]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="basis-full lg:basis-1/2">
          {main_image && (
            <ProductCarousel images={otherImages} mainImage={main_image} />
          )}
        </div>
        <div className="basis-full lg:basis-1/2">
          <div className="flex flex-col gap-6 md:gap-10">
            <ProductSummary product={response} />
            <ProductVariations />
            <ProductDetails product={response} />
            {/*TODO: make this an optional part in CLI */}
            <ProductSubscriptions product={response} />
            {extensions && <ProductExtensions extensions={extensions} />}
            <StatusButton
              disabled={
                product.kind === "base-product" ||
                (offeringId ? !planId : false)
              }
              type="button"
              onClick={handleAddToCart}
              status={isPending ? "loading" : "idle"}
            >
              ADD TO CART
            </StatusButton>
          </div>
        </div>
      </div>
    </div>
  );
}
