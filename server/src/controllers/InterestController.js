import { ForbiddenError } from '../core/errors.js';
import { sendCreated, sendSuccess } from '../core/http.js';

export class InterestController {
  constructor({ interestService }) {
    this.interestService = interestService;
  }

  send = async (req, res) => {
    const interest = await this.interestService.send(
      req.auth.userId,
      req.validated.body.targetProfileId
    );
    return sendCreated(res, interest);
  };

  sendLegacy = async (req, res) => {
    const { id, targetId } = req.validated.params;
    if (id !== req.auth.userId) {
      throw new ForbiddenError('You can only send interests from your own account.');
    }
    const interest = await this.interestService.send(id, targetId);
    return sendCreated(res, interest);
  };

  sent = async (req, res) => {
    const interests = await this.interestService.listSent(req.auth.userId);
    return sendSuccess(res, { interests });
  };

  received = async (req, res) => {
    const interests = await this.interestService.listReceived(req.auth.userId);
    return sendSuccess(res, { interests });
  };

  updateStatus = async (req, res) => {
    const interest = await this.interestService.updateStatus(
      req.auth.userId,
      req.validated.params.id,
      req.validated.body.status
    );
    return sendSuccess(res, interest);
  };

  withdraw = async (req, res) => {
    await this.interestService.withdraw(req.auth.userId, req.validated.params.id);
    return sendSuccess(res, { deleted: true });
  };
}

export default InterestController;
