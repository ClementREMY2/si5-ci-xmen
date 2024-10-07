import axios from "axios";
import { Constants } from "../utils/Constants";
import { TableOrderNBCustomers, TableBackend } from "../interfaces/Table";

export const getMenu = async () => {
  try {
    const response = await axios.get(
      Constants.gatewayUrl + "dining/doc/dining"
    );
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du menu");
  }
};

export const checkDiningHealth = async () => {
  try {
    const response = await axios.get(
      Constants.gatewayUrl + "/dining-service/health"
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de la santé du DiningService:",
      error
    );
    throw error;
  }
};

export const getTables = async () => {
  try {
    const response = await axios.get(Constants.gatewayUrl + "dining/tables");
    const data = response.data;

    return data.map((item: any) => ({
      _id: item._id,
      number: item.number,
      taken: item.taken,
      tableOrderId: item.tableOrderId,
    })) as TableBackend[];
  } catch (error) {
    console.error("Erreur lors de la récupération des tables:", error);
    throw error;
  }
};

export const getTable = async (tableId: number) => {
  try {
    const response = await axios.get(
      Constants.gatewayUrl + "dining/tables/" + tableId
    );
    const data = response.data;

    return {
      _id: data._id,
      number: data.number,
      taken: data.taken,
      tableOrderId: data.tableOrderId,
    } as TableBackend;
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      throw new Error("TableIdNotFoundException");
    }
    console.error("Erreur lors de la récupération de la table:", error);
    throw error;
  }
};

export const updateTable = async (updatedTable: TableOrderNBCustomers) => {
  try {
    const response = await axios.post(
      Constants.gatewayUrl + "dining/tableOrders",
      updatedTable
    );
    return response.data;
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      throw new Error("TableIdNotFoundException");
    }
    console.error("Erreur lors de la mise à jour de la table:", error);
    throw error;
  }
};

export const getTableOrders = async () => {
  try {
    const response = await axios.get(Constants.gatewayUrl + "/tableOrders");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes de table:",
      error
    );
    throw error;
  }
};

export const updateTableOrder = async (
  tableOrderId: number,
  updatedOrder: any
) => {
  try {
    const response = await axios.post(
      Constants.gatewayUrl + "/tableOrders/" + tableOrderId,
      updatedOrder
    );
    return response.data;
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      throw new Error("TableOrderIdNotFoundException");
    }
    console.error("Erreur lors de la mise à jour de la commande:", error);
    throw error;
  }
};

export const updateOrderingItemIdDTO = async (
  tableOrderId: number,
  orderingItemIdDTO: any
) => {
  try {
    const response = await axios.post(
      Constants.gatewayUrl + "tableOrders/" + tableOrderId,
      orderingItemIdDTO
    );
    return response.data;
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      throw new Error("TableOrderIdNotFoundException");
    }
    console.error("Erreur lors de la mise à jour de la commande:", error);
    throw error;
  }
};
