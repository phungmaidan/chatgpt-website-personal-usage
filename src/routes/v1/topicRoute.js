// src/routes/v1/chatRoute.js
import express from 'express';
import { topicValidation } from '../../validations/topicValidation.js';
import { topicController } from '../../controllers/topicController.js';
const Router = express.Router();

Router.route('/')
    .post(topicValidation.createNew, topicController.createNew)

export const topicRoute = Router;
