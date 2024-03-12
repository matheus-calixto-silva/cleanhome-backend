import { Router } from 'express';
import {
  createNewClient,
  getAllClients,
  getClientsByLocation,
} from '../services/clientsService';

export const clientsRouter = Router();

clientsRouter.get('/clients', getAllClients);

clientsRouter.get('/clients/visit-order', getClientsByLocation);

clientsRouter.post('/clients', createNewClient);
