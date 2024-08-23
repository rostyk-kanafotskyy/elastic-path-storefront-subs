import { useCallback, useContext, useEffect, useState } from "react";
import {
  SubscriptionOffering,
  SubscriptionOfferingPlan,
} from "@elasticpath/js-sdk";
import { getOfferingPlans } from "../../../services/subscriptions";
import { getEpccImplicitClient } from "../../../lib/epcc-implicit-client";
import { RadioGroupItem } from "../../radio-group/RadioGroup";
import { Label } from "../../label/Label";
import { useAddSubscriptionItemToCart } from "@elasticpath/react-shopper-hooks";
import { SubscriptionContext } from "../../../lib/subscription-context";

interface IProductSubscriptionOption {
  offering: SubscriptionOffering;
  selected: boolean;
}

const ProductSubscriptionOption = ({
  offering,
  selected,
}: IProductSubscriptionOption): JSX.Element => {
  const client = getEpccImplicitClient();
  const { planId, setPlanId } = useContext(SubscriptionContext);

  const [plans, setPlans] = useState<SubscriptionOfferingPlan[]>([]);

  const getPlansData = useCallback(async (): Promise<void> => {
    try {
      const offeringPlansResponse = await getOfferingPlans(offering.id, client);
      setPlans(offeringPlansResponse.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getPlansData();
  }, [getPlansData]);

  return (
    <div className="p-4 border rounded-lg max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RadioGroupItem value={offering.id} id={offering.id} />
          <Label
            className="hover:cursor-pointer text-red-500 font-semibold text-base"
            htmlFor={offering.id}
          >
            {offering.attributes.name}
          </Label>
        </div>
        <span className="text-gray-700 font-medium">
          {_extractPriceFromPlansArray(planId, plans)}
        </span>
      </div>

      {selected && (
        <div className="my-4">
          <select
            value={planId ?? "default"}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full border-gray-300 rounded-md"
          >
            <option value="default" disabled>
              Select your option
            </option>
            {plans?.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.attributes.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const _extractPriceFromPlansArray = (
  planId: string,
  plansList: SubscriptionOfferingPlan[],
): string => {
  const plan = plansList.find((plan) => plan.id === planId);
  // TODO: Update SDK types, handle multiple price types
  return plan?.meta?.display_price?.with_tax?.formatted ?? "";
};

export default ProductSubscriptionOption;
