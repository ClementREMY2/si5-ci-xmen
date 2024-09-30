import axios from 'axios';
import { Constants } from '../utils/Constants'
import { Table, TableOrderDTO, TableWithOrderDto } from '../interfaces/Table';
import { OrderDTO } from '../interfaces/Order';

export const getMenu = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'dining/doc/dining');
                return response.data;
        } catch (error) {
                throw new Error('Erreur lors de la récupération du menu');
        }
};

export const checkDiningHealth = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/dining-service/health');
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la vérification de la santé du DiningService:', error);
                throw error;
        }
};

export const getTables = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'dining/tables');
                const data = response.data;

                return data.map((item: any) => ({
                        _id: item._id,
                        number: item.number,
                        taken: item.taken,
                        tableOrderId: item.tableOrderId,
                      })) as TableWithOrderDto[];
        } catch (error) {
                console.error('Erreur lors de la récupération des tables:', error);
                throw error;
        }
};

export const getTablesOrders = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'dining/tableOrders');
                const data = response.data;

                return data.map((item: any) => ({
                        _id: item._id,
                        tableNumber: item.tableNumber,
                        customersCount: item.customersCount,
                        opened: item.opened,
                        lines: item.lines,
                        preparations: item.preparations,
                        billed: item.billed,
                      })) as OrderDTO[];
        } catch (error) {
                console.error('Erreur lors de la récupération des commandes de table:', error);
                throw error;
        }
}

export const updateTable = async (updatedTable: TableOrderDTO) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + 'dining/tableOrders', updatedTable);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableIdNotFoundException');
                }
                console.error('Erreur lors de la mise à jour de la table:', error);
                throw error;
        }
}

export const addTable = async (newTable: { tableNumber: number, seats: number }) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tables', newTable);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 409) {
                        throw new Error('TableAlreadyExistsException');
                }
                console.error('Erreur lors de l\'ajout de la table:', error);
                throw error;
        }
};

export const getTableByNumber = async (tableNumber: Table["table"]) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/tables/' + tableNumber);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableNumberNotFoundException');
                }
                console.error('Erreur lors de la récupération de la table:', error);
                throw error;
        }
};

export const getTableOrders = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/tableOrders');
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la récupération des commandes de table:', error);
                throw error;
        }
};

export const addTableOrder = async (newTableOrder: { tableNumber:  Table["table"], items: { itemId: number, quantity: number }[] }) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tableOrders', newTableOrder);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 409) {
                        throw new Error('TableAlreadyTakenException');
                }
                console.error('Erreur lors de l\'ajout de la commande de table:', error);
                throw error;
        }
};

export const getTableOrderById = async (tableOrderId: number) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/tableOrders/' + tableOrderId);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableOrderIdNotFoundException');
                }
                console.error('Erreur lors de la récupération de la commande de table:', error);
                throw error;
        }
};

export const updateTableOrder = async (tableOrderId: number, updatedOrder: any) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tableOrders/' + tableOrderId, updatedOrder);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableOrderIdNotFoundException');
                }
                console.error('Erreur lors de la mise à jour de la commande:', error);
                throw error;
        }
};

export  const updateOrderingItemIdDTO = async (tableOrderId: number, orderingItemIdDTO: any) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tableOrders/' + tableOrderId, orderingItemIdDTO);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableOrderIdNotFoundException');
                }
                console.error('Erreur lors de la mise à jour de la commande:', error);
                throw error;
        }
}

export const prepareTableOrder = async (tableOrderId: number) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tableOrders/' + tableOrderId + '/prepare');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableOrderIdNotFoundException');
                }
                console.error('Erreur lors de la préparation de la commande:', error);
                throw error;
        }
};

export const billTableOrder = async (tableOrderId: number) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/tableOrders/' + tableOrderId + '/bill');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 409) {
                        throw new Error('TableOrderAlreadyBilledException');
                } else if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('TableOrderIdNotFoundException');
                }
                console.error('Erreur lors de la facturation de la commande:', error);
                throw error;
        }
};

