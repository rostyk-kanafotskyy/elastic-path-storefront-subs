import { useCallback, useContext, useEffect, useState } from "react";
import {
  ShopperProduct,
  useAuthedAccountMember,
} from "@elasticpath/react-shopper-hooks";
import { SubscriptionOffering } from "@elasticpath/js-sdk";
import { getOfferings } from "../../../services/subscriptions";
import { getEpccImplicitClient } from "../../../lib/epcc-implicit-client";
import { RadioGroup, RadioGroupItem } from "../../radio-group/RadioGroup";
import { Label } from "../../label/Label";
import ProductSubscriptionOption from "./ProductSubscribtionOption";
import { SubscriptionContext } from "../../../lib/subscription-context";
import Price from "../Price";

interface IProductSubscriptions {
  product: ShopperProduct["response"];
}

const ProductSubscriptions = ({
  product,
}: IProductSubscriptions): JSX.Element => {
  const client = getEpccImplicitClient();

  const oneTimePurchasesKey = "one-time";
  const {
    id: productId,
    meta: { display_price },
  } = product;

  const { setPlanId, setOfferingId } = useContext(SubscriptionContext);
  const [purchaseOption, setPurchaseOption] = useState<string>();
  const [offerings, setOfferings] = useState<SubscriptionOffering[]>();

  const getSubscriptionData = useCallback(async (): Promise<void> => {
    try {
      const offeringsResponse = await getOfferings(client, {
        eq: { "products.external_ref": productId },
      });

      setOfferings(offeringsResponse.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getSubscriptionData();
  }, [getSubscriptionData]);

  if (!offerings) {
    return null;
  }

  const handlePurchaseOptionChange = (option: string) => {
    setPurchaseOption(option);
    if (setOfferingId !== oneTimePurchasesKey) {
      setOfferingId(option);
    } else {
      setOfferingId();
      setPlanId();
    }
  };

  return (
    <RadioGroup
      className="space-y-4"
      onValueChange={handlePurchaseOptionChange}
      defaultValue={oneTimePurchasesKey}
    >
      {offerings.map((offering) => (
        <ProductSubscriptionOption
          key={offering.id}
          offering={offering}
          selected={purchaseOption === offering.id}
        />
      ))}
      <div className="p-4 border rounded-lg max-w-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value={oneTimePurchasesKey}
              id={oneTimePurchasesKey}
            />
            <Label
              className="hover:cursor-pointer font-semibold text-base"
              htmlFor={oneTimePurchasesKey}
            >
              One-time purchase
            </Label>
          </div>
          {display_price && (
            <Price
              price={display_price.without_tax.formatted}
              currency={display_price.without_tax.currency}
              size="text-2xl"
            />
          )}
        </div>
      </div>
    </RadioGroup>
  );
};

export default ProductSubscriptions;
