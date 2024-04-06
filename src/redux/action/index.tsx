import { ADD_ITEM, REMOVE_ITEM } from "./actionTypes";

export const addItemToCart = (data: any) => ({
  type: ADD_ITEM,
  payload: data,
});

export const removeItemToCart = (index: any) => ({
  type: REMOVE_ITEM,
  payload: index,
});
