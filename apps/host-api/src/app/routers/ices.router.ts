import { Router } from 'express';
import icesController from '../controllers/ices.controller';

const icesRouter = Router();
icesRouter.route('/next/:id').put(icesController.nextSong);
icesRouter.route('/start/:id').post(icesController.startContainer);
icesRouter.route('/remove/:id').delete(icesController.removeContainer);
export default icesRouter;
