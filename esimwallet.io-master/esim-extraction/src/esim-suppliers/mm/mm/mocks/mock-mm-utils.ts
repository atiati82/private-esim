import {
  MmProduct,
  MmProductDetails_PlanDetails,
  MmProductDetailsType,
} from '../mm-products.types';
import { mockMmProduct_Viettel_eSIM } from '../mocks/mm-products.mock';

/**
 * Create mock MmProduct with provided ProductDetails
 */
export function mockMmProductWithDetails(
  mockDetails: string | MmProductDetails_PlanDetails,
  sourceObj = mockMmProduct_Viettel_eSIM,
  textItems?: string[],
): MmProduct {
  // remove additional details (normally we want to test in isolation provided textual info, nothing else)
  const mmProductNoAdditionalDetails = mockMmProductWithAdditionalDetails('', sourceObj);
  const mmProduct: MmProduct = {
    ...mmProductNoAdditionalDetails,
    productDetails: [...mmProductNoAdditionalDetails.productDetails],
  };

  const isFullDetailsObj = !!(mockDetails && typeof mockDetails === 'object');
  let mmProductDetailsKey = mmProduct.productDetails.findIndex(
    (d) => d.name === MmProductDetailsType.PlanDetails,
  );
  if (mmProductDetailsKey < 0) {
    mmProductDetailsKey = mmProduct.productDetails.length;
  }

  const currentProductDetails: MmProductDetails_PlanDetails = JSON.parse(
    mmProduct.productDetails[mmProductDetailsKey].value as string,
  );
  if (textItems) {
    currentProductDetails.items = textItems;
  }

  mmProduct.productDetails[mmProductDetailsKey] = {
    name: MmProductDetailsType.PlanDetails,
    value: isFullDetailsObj
      ? JSON.stringify(mockDetails, null, 2)
      : JSON.stringify(
          <MmProductDetails_PlanDetails>{
            ...currentProductDetails,
            description: mockDetails,
          },
          null,
          2,
        ),
  };

  /**
  console.log('mockMmProductWithDetails(), prepared mock product', {
    sourceObj,
    sourceObjProductDetails: sourceObj.productDetails,
    preparedMockProduct: mmProduct,
    isFullDetailsObj,
    mmProductDetailsKey,
    preparedMockProductDetailsList: mmProduct.productDetails,
  });/**/

  return mmProduct;
}

/**
 * Create mock MmProduct with provided AdditionalDetails
 */
export function mockMmProductWithAdditionalDetails(
  mockDetails: string | MmProductDetails_PlanDetails,
  sourceObj = mockMmProduct_Viettel_eSIM,
): MmProduct {
  const mmProduct: MmProduct = {
    ...sourceObj,
    productDetails: [...sourceObj.productDetails],
  };

  const isFullDetailsObj = !!(mockDetails && typeof mockDetails === 'object');
  let mmProductAdditionalDetailsKey = mmProduct.productDetails.findIndex(
    (d) => d.name === MmProductDetailsType.AdditionalDetails,
  );
  if (mmProductAdditionalDetailsKey < 0) {
    mmProductAdditionalDetailsKey = mmProduct.productDetails.length;
  }

  const value = isFullDetailsObj
    ? `${mockDetails.heading}<br />${mockDetails.items.join('<br />')}`
    : mockDetails;

  mmProduct.productDetails[mmProductAdditionalDetailsKey] = {
    name: MmProductDetailsType.AdditionalDetails,
    value: value,
  };

  /**
  console.log('mockMmProductWithAdditionalDetails(), prepared mock product', {
    sourceObj,
    sourceObjProductDetails: sourceObj.productDetails,
    preparedMockProduct: mmProduct,
    isFullDetailsObj,
    mmProductAdditionalDetailsKey,
    preparedMockProductDetailsList: mmProduct.productDetails,
  }); /**/

  return mmProduct;
}
