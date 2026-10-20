import { ForbiddenError } from '../core/errors.js';
import { sendSuccess } from '../core/http.js';

export class ProfileController {
  constructor({ profileService, profilePresenter }) {
    this.profileService = profileService;
    this.profilePresenter = profilePresenter;
  }

  me = async (req, res) => {
    const profile = await this.profileService.getCurrent(req.auth.userId);
    return sendSuccess(res, this.profilePresenter.toApi(profile, { isOwner: true }));
  };

  getById = async (req, res) => {
    const { id } = req.validated.params;
    const viewerId = req.auth?.userId || null;
    const profile = await this.profileService.getById(id, { viewerId });
    return sendSuccess(
      res,
      this.profilePresenter.toApi(profile, { isOwner: profile.id === viewerId })
    );
  };

  updateMe = async (req, res) => {
    const profile = await this.profileService.updateCurrent(
      req.auth.userId,
      req.validated.body
    );
    return sendSuccess(res, this.profilePresenter.toApi(profile, { isOwner: true }));
  };

  updateById = async (req, res) => {
    const { id } = req.validated.params;
    if (id !== req.auth.userId) {
      throw new ForbiddenError('You can only edit your own profile.');
    }
    return this.updateMe(req, res);
  };

  deleteMe = async (req, res) => {
    await this.profileService.deleteCurrent(req.auth.userId);
    return sendSuccess(res, { deleted: true });
  };

  search = async (req, res) => {
    const filters = req.validated.query || {};
    const viewerId = req.auth?.userId || null;
    const result = await this.profileService.search(filters, { viewerId });

    return sendSuccess(res, {
      profiles: this.profilePresenter.toList(result.profiles),
      pagination: result.pagination,
    });
  };
}

export default ProfileController;
