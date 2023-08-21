export interface Country {
  displayName: string;
  englishName: string;
  id: string;
  nativeName: string;
  threeLetterISORegionName: string;
  twoLetterISORegionName: string;
}

export interface Currency {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  englishName: string;
  twoLetterISOLanguageName: string;
}

export interface Nace {
  codeValue: string;
  dotNotationCodeValue?: string;
  topLevelGroupCode?: string;
  order: number;
  uri: string;
  hierarchyLevel: number;
  prefLabel: {
    en: string;
  };
  broaderCode?: {
    codeValue: string;
    order: number;
    hierarchyLevel: number;
  };
  children?: Nace[];
}

export interface WorkPermit {
  codeValue: string;
  order: number;
  uri: string;
  hierarchyLevel: number;
  prefLabel: {
    en: string;
  };
}

export interface EducationField {
  codeValue: string;
  hierarchyLevel: number;
  order: number;
  prefLabel: { fi: string };
  uri: string;
}
export interface EducationLevel {
  codeValue: string;
  order: number;
  uri: string;
  hierarchyLevel: number;
  prefLabel: {
    en: string;
  };
}

export interface Region {
  statisticsFinlandCode: string;
  code: string;
  label: {
    en: string;
  };
}

export interface Municipality {
  Koodi: string;
  Selitteet: { Kielikoodi: string; Teksti: string }[];
}

export interface Occupation {
  notation: string;
  uri: string;
  prefLabel: {
    en: string;
  };
  narrower?: Occupation[];
}

export interface EscoLanguage {
  id: string;
  name: string;
  twoLetterISOLanguageName: string;
  threeLetterISOLanguageName: string;
  escoUri: string;
}

export interface LanguageSkillLevel {
  codeValue: string;
  prefLabel: {
    en: string;
    fi: string;
  };
  uri: string;
}

export interface EscoSkill {
  uri: string;
  prefLabel: {
    en: string;
  };
}
