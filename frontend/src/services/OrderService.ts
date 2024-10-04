import axios from 'axios';
import { Constants } from '../utils/Constants'
import { OrderBackend } from '../interfaces/Order';

export const getTableOrders = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'dining/tables');
                const data = response.data;

                return data.map((item: any) => ({
                        _id: item._id,
                        tableNumber: item.tableNumber,
                        customersCount: item.customersCount,
                        opened: item.opened,
                        lines: item.lines,
                        preparations: item.preparations,
                        billed: item.billed,
                      })) as OrderBackend[];
        } catch (error) {
                console.error('Erreur lors de la récupération des tables:', error);
                throw error;
        }
}

     
