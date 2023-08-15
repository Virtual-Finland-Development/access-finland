import { Output, array, number, object, string } from 'valibot';
export const JmfRecommendationSchema = object({
  uri: string(),
  label: string(),
});
export type JmfRecommendation = Output<typeof JmfRecommendationSchema>; 

export const JmfRecommendationsRequestPayloadSchema = object({
  text: string(),
  maxNumberOfSkills: number(),
  maxNumberOfOccupations: number(),
  language: string(),
});
export type JmfRecommendationsRequestPayload = Output<typeof JmfRecommendationsRequestPayloadSchema>; 

export const JmfRecommendationsResponseSchema = object({
  skills: array(JmfRecommendationSchema),
  occupations: array(JmfRecommendationSchema),
});
export type JmfRecommendationsResponse = Output<typeof JmfRecommendationsResponseSchema>; 

