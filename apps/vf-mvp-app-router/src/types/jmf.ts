export interface JmfRecommendation {
  uri: string;
  label: string;
}

export interface JmfRecommendationsRequestPayload {
  text: string;
  maxNumberOfSkills: number;
  maxNumberOfOccupations: number;
  language: string;
}

export interface JmfRecommendationsResponse {
  skills: JmfRecommendation[];
  occupations: JmfRecommendation[];
}
