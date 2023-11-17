export interface PersonWorkPermit {
  permitName: string;
  permitAccepted: boolean;
  permitType?: 'A' | 'B';
  validityStart?: string;
  validityEnd?: string;
  industries?: string[];
  employerName?: string;
}
