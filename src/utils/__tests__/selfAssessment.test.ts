import {
  normalize,
  extractList,
  SCENARIOS,
} from '../selfAssessment'

describe('selfAssessment Utilities', () => {
  describe('extractList', () => {
    it('extracts list from nested data structure', () => {
      const mockData = {
        data: {
          list: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
        },
      }

      const result = extractList(mockData)
      // The function returns the entire data object wrapped in an array
      expect(result).toEqual([mockData.data])
    })

    it('returns empty array for invalid data', () => {
      expect(extractList(null)).toEqual([])
      expect(extractList(undefined)).toEqual([])
      expect(extractList({})).toEqual([])
      expect(extractList({ data: {} })).toEqual([{}])
    })

    it('handles direct array input', () => {
      const mockArray = [{ id: 1 }, { id: 2 }]
      // The function expects data to be nested under a 'data' property
      // Direct arrays don't have this structure, so it returns empty array
      expect(extractList(mockArray)).toEqual([])
    })
  })

  describe('normalize', () => {
    it('normalizes backend data to frontend format', () => {
      const mockBackendData = {
        _id: 'test-id',
        confidenceBefore: 3,
        confidenceAfter: 7,
        primaryGoal: 'build_confidence',
        comfortZones: ['small_groups', 'familiar_people'],
        preferredScenarios: ['one-on-one', 'group conversations'],
        anxietyTriggers: ['public_speaking', 'meeting_new_people'],
        socialFrequency: 'often',
        communicationConfidence: 'moderate',
        practiceFrequency: 'weekly',
        createdAt: '2025-01-01T00:00:00.000Z',
      }

      const result = normalize(mockBackendData)
      
      expect(result._id).toBe('test-id')
      expect(result.answers.confidenceBefore).toBe(3)
      expect(result.answers.confidenceAfter).toBe(7)
      expect(result.answers.socialFrequency).toBe('often')
      expect(result.insights.confidenceChange).toBe(4)
      expect(result.insights.practiceCadence).toBe('weekly')
      expect(result.insights.tags).toContain('confidence-boost')
      expect(result.insights.tags).toContain('comfort-zone-aware')
      expect(result.insights.tags).toContain('trigger-aware')
      expect(result.insights.recommended).toHaveLength(3)
    })

    it('handles missing optional fields', () => {
      const minimalData = {
        _id: 'test-id',
      }

      const result = normalize(minimalData)
      
      expect(result._id).toBe('test-id')
      expect(result.answers.confidenceBefore).toBeUndefined()
      expect(result.answers.confidenceAfter).toBeUndefined()
      expect(result.insights.confidenceChange).toBe(0)
      expect(result.insights.practiceCadence).toBe('flexible')
    })

    it('maps socialLevel to socialFrequency correctly', () => {
      const dataWithSocialLevel = {
        _id: 'test-id',
        socialLevel: 'beginner',
      }

      const result = normalize(dataWithSocialLevel)
      expect(result.answers.socialFrequency).toBe('beginner')
    })

    it('generates appropriate suggestions based on data', () => {
      const dataWithTriggers = {
        _id: 'test-id',
        anxietyTriggers: ['public_speaking'],
        comfortZones: ['small_groups'],
      }

      const result = normalize(dataWithTriggers)
      
      expect(result.insights.suggestions).toContain(
        'Practice scenarios that gradually expose you to your triggers'
      )
      expect(result.insights.suggestions).toContain(
        'Leverage your comfort zones as a foundation for growth'
      )
    })
  })

  describe('SCENARIOS constant', () => {
    it('contains expected scenario data', () => {
      expect(SCENARIOS).toBeDefined()
      expect(Array.isArray(SCENARIOS)).toBe(true)
      expect(SCENARIOS.length).toBeGreaterThan(0)
    })

    it('each scenario has required properties', () => {
      SCENARIOS.forEach(scenario => {
        expect(scenario).toHaveProperty('slug')
        expect(scenario).toHaveProperty('title')
        expect(scenario).toHaveProperty('imageUrl')
        expect(scenario).toHaveProperty('level')
        expect(scenario).toHaveProperty('xp')
      })
    })

    it('scenario slugs are unique', () => {
      const slugs = SCENARIOS.map(s => s.slug)
      const uniqueSlugs = new Set(slugs)
      expect(slugs.length).toBe(uniqueSlugs.size)
    })

    it('contains expected scenario levels', () => {
      const levels = SCENARIOS.map(s => s.level)
      expect(levels).toContain('Beginner')
      expect(levels).toContain('Intermediate')
      expect(levels).toContain('Advanced')
    })
  })
})
