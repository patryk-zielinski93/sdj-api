import { Router } from 'express';
import icesRouter from './ices.router';

export const router = Router();

router.use('/', icesRouter);
