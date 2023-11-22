export interface PersonWorkPermit {
  permitName: string;
  permitAccepted: boolean;
  permitType?: string;
  validityStart?: string;
  validityEnd?: string;
  industries: string[];
  employerName?: string;
}
