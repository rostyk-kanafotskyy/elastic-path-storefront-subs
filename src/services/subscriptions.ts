import type {
  ResourceList,
  ResourcePage,
  SubscriptionOffering,
  SubscriptionOfferingFilter,
  SubscriptionOfferingPlan,
} from "@elasticpath/js-sdk";
import { ElasticPath } from "@elasticpath/js-sdk";

export async function getOfferings(
  client: ElasticPath,
  filters?: SubscriptionOfferingFilter,
): Promise<ResourcePage<SubscriptionOffering>> {
  const offeringRequest = client.SubscriptionOfferings;

  if (filters) {
    offeringRequest.Filter(filters);
  }

  return offeringRequest.All();
}

export async function getOfferingPlans(
  offeringId: string,
  client: ElasticPath,
): Promise<ResourceList<SubscriptionOfferingPlan>> {
  return client.SubscriptionOfferings.GetAttachedPlans(offeringId);
}
