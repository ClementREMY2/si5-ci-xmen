import axios from 'axios';
import { Constants } from '../utils/Constants'
import { MenuBackendNoId, MenuItem } from '../interfaces/Menu'

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

export const getMenusGateway = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + `menu/menus`);
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la récupération des menus:', error);
                throw error;
        }
};

export const addMenu = async (newMenuItem: MenuBackendNoId) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + 'menu/menus', newMenuItem);
                return response.data;   
        } catch (error) {
                console.error('Erreur lors de l\'ajout du menu:', error);
                throw error;
        }
};

export const getMenuById = async (id: string) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + `menu/menus/${id}`);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('MenuItemIdNotFoundException');
                }
                console.error('Erreur lors de la récupération du menu par ID:', error);
                throw error;
        }
};

export const postMenu = async (menu: MenuBackendNoId) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + `menu/menus`, menu);
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la création du menu:', error);
                throw error;
        }
}