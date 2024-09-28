import axios from 'axios';
import { Constants } from '../utils/Constants'


export const getMenu = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + 'kitchen/doc/kitchen');
                return response.data;
        } catch (error) {
                throw new Error('Erreur lors de la récupération du menu');
        }
};

export const checkKitchenHealth = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/health');
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la vérification de la santé du KitchenService:', (error as any).message);
                throw error;
        }
};

export const getPreparations = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/preparations');
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la récupération des préparations:', (error as any).message);
                throw error;
        }
};

export const addPreparation = async (newPreparation: any) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/preparations', newPreparation);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 400) {
                        throw new Error('EmptyItemsToBeCookedSentInKitchenException');
                }
                console.error('Erreur lors de l\'ajout de la préparation:', (error as any).message);
                throw error;
        }
};

export const getPreparationById = async (preparationId: number) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/preparations/' + preparationId);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparationIdNotFoundException');
                }
                console.error('Erreur lors de la récupération de la préparation:', (error as any).message);
                throw error;
        }
};

export const takePreparationToTable = async (preparationId: number) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/preparations/' + preparationId + '/takenToTable');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparationIdNotFoundException');
                } else if ((error as any).response && (error as any).response.status === 400) {
                        throw new Error('PreparationNotReadyInKitchenException');
                }
                console.error('Erreur lors de la prise de la préparation pour servir:', (error as any).message);
                throw error;
        }
};

export const getPreparedItemById = async (preparedItemId: number) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/preparedItems/' + preparedItemId);
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparedItemIdNotFoundException');
                }
                console.error('Erreur lors de la récupération de l\'item préparé:', (error as any).message);
                throw error;
        }
};

export const getPreparedItemRecipe = async (preparedItemId: number) => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/preparedItems/' + preparedItemId + '/recipe');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparedItemIdNotFoundException');
                }
                console.error('Erreur lors de la récupération de la recette de l\'item préparé:', (error as any).message);
                throw error;
        }
};

export const getAllPreparedItems = async () => {
        try {
                const response = await axios.get(Constants.gatewayUrl + '/preparedItems');
                return response.data;
        } catch (error) {
                console.error('Erreur lors de la récupération des items préparés:', (error as any).message);
                throw error;
        }
};

export const startPreparedItem = async (preparedItemId: number) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/preparedItems/' + preparedItemId + '/start');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 400) {
                        throw new Error('ItemAlreadyStartedToBeCookedException');
                }
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparedItemIdNotFoundException');
                }
                console.error('Erreur lors du démarrage de la préparation de l\'item:', (error as any).message);
                throw error;
        }
};

export const finishPreparedItem = async (preparedItemId: number) => {
        try {
                const response = await axios.post(Constants.gatewayUrl + '/preparedItems/' + preparedItemId + '/finish');
                return response.data;
        } catch (error) {
                if ((error as any).response && (error as any).response.status === 404) {
                        throw new Error('PreparedItemIdNotFoundException');
                } else if ((error as any).response && (error as any).response.status === 400) {
                        throw new Error('ItemNotStartedToBeCookedException');
                }
                console.error('Erreur lors de la fin de la préparation de l\'item:', (error as any).message);
                throw error;
        }
};