/**
 * Presentation layer for profiles. Controllers never serialize domain models
 * directly, which keeps privacy rules (owner-only contact details) in one place.
 */
export class ProfilePresenter {
  toApi(profile, { isOwner = false } = {}) {
    return profile.toApi({ includePrivate: isOwner });
  }

  toSummary(profile) {
    const api = profile.toApi({ includePrivate: false });
    return {
      id: api.id,
      username: api.username,
      fullName: api.fullName,
      gender: api.gender,
      dateOfBirth: api.dateOfBirth,
      age: api.age,
      maritalStatus: api.maritalStatus,
      country: api.country,
      state: api.state,
      city: api.city,
      languages: api.languages,
      occupations: api.occupations,
      income: api.income,
      education: api.education,
      aboutMe: api.aboutMe,
      myExpectation: api.myExpectation,
      image: api.image,
      isPublic: api.isPublic,
    };
  }

  toList(profiles) {
    return profiles.map((profile) => this.toSummary(profile));
  }
}

export default ProfilePresenter;
