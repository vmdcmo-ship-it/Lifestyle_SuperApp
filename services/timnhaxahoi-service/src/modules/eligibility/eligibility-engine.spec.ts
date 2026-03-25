import { LeadSegment } from '../../entities/lead-segment.enum';
import { ProjectKind, ProjectStatus } from '../../entities/housing-project.entity';
import { evaluateEligibility } from './eligibility-engine';
import type { HousingProject } from '../../entities/housing-project.entity';

function mockProject(overrides: Partial<HousingProject> = {}): HousingProject {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Test',
    slug: 'test',
    lat: 0,
    lng: 0,
    province: null,
    district: null,
    pricePerM2: 20_000_000,
    typicalAreaM2: 70,
    totalUnits: null,
    status: ProjectStatus.SELLING,
    legalScore: 80,
    images: null,
    videosUrl: null,
    legalInfo: null,
    kind: ProjectKind.NOXH,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('evaluateEligibility', () => {
  const pid = '00000000-0000-4000-8000-000000000001';

  it('returns ORANGE_SPECIAL when incomeBracket is 3', () => {
    const r = evaluateEligibility(
      {
        priorityGroup: 2,
        residenceStatus: 1,
        incomeBracket: 3,
        housingStatus: 1,
        priorityProjectIds: [pid],
        ownCapitalMillion: 500,
        borrowedCapitalMillion: 0,
        loanPreference: 2,
        maxMonthlyPaymentMillion: 10,
        consultationFocus: 1,
      },
      [mockProject({ id: pid })],
    );
    expect(r.segment).toBe(LeadSegment.ORANGE_SPECIAL);
  });

  it('returns GREEN when legal core ok and own capital >= 20% of estimated price', () => {
    const r = evaluateEligibility(
      {
        priorityGroup: 1,
        residenceStatus: 1,
        incomeBracket: 1,
        housingStatus: 1,
        priorityProjectIds: [pid],
        ownCapitalMillion: 400,
        borrowedCapitalMillion: 0,
        loanPreference: 2,
        maxMonthlyPaymentMillion: 8,
        consultationFocus: 1,
      },
      [mockProject({ id: pid, pricePerM2: 10_000_000, typicalAreaM2: 70 })],
    );
    expect(r.segment).toBe(LeadSegment.GREEN);
  });

  it('returns RED when priorityGroup is 5 (ngoài nhóm ưu tiên NOXH)', () => {
    const r = evaluateEligibility(
      {
        priorityGroup: 5,
        residenceStatus: 1,
        incomeBracket: 1,
        housingStatus: 1,
        priorityProjectIds: [pid],
        ownCapitalMillion: 400,
        borrowedCapitalMillion: 0,
        loanPreference: 2,
        maxMonthlyPaymentMillion: 8,
        consultationFocus: 1,
      },
      [mockProject({ id: pid })],
    );
    expect(r.segment).toBe(LeadSegment.RED);
  });

  it('returns YELLOW when residenceStatus is 3 (cần bổ sung cư trú)', () => {
    const r = evaluateEligibility(
      {
        priorityGroup: 2,
        residenceStatus: 3,
        incomeBracket: 1,
        housingStatus: 1,
        priorityProjectIds: [pid],
        ownCapitalMillion: 400,
        borrowedCapitalMillion: 0,
        loanPreference: 2,
        maxMonthlyPaymentMillion: 8,
        consultationFocus: 1,
      },
      [mockProject({ id: pid })],
    );
    expect(r.segment).toBe(LeadSegment.YELLOW);
  });

  it('returns YELLOW when no priority projects selected', () => {
    const r = evaluateEligibility(
      {
        priorityGroup: 1,
        residenceStatus: 1,
        incomeBracket: 1,
        housingStatus: 1,
        priorityProjectIds: [],
        ownCapitalMillion: 400,
        borrowedCapitalMillion: 0,
        loanPreference: 2,
        maxMonthlyPaymentMillion: 8,
        consultationFocus: 1,
      },
      [],
    );
    expect(r.segment).toBe(LeadSegment.YELLOW);
  });
});
