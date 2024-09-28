import axios from 'axios';
import { Constants } from '../utils/Constants'
import { MenuItem } from '../interfaces/Menu'

export const getMenu = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'menu/doc/menus');
                return response.data;
        } catch (error) {
                throw new Error('Erreur lors de la récupération du menu');
        }
};

export const checkHealth = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + `/health`);
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la vérification de la santé du service:', error);
                throw error;
        }
};

export const getMenus = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + `/menus`);
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la récupération des menus:', error);
                throw error;
        }
};

export const addMenu = async (newMenuItem: MenuItem) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + `/menus`, newMenuItem);
                return response.data;
        } catch (error) {
                console.error('Erreur lors de l\'ajout du menu:', error);
                throw error;
        }
};

export const getMenuItemById = async (menuItemId: MenuItem["id"]) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + `/menus/${menuItemId}`);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('MenuItemIdNotFoundException');
                }
                console.error('Erreur lors de la récupération du menu par ID:', error);
                throw error;
        }
};

      