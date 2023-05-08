import apiClient from './api-client';
import * as auth from './services/auth';
import * as codesets from './services/codesets';
import * as company from './services/company';
import * as jmf from './services/jmf';
import * as profile from './services/profile';

const api = {
  client: apiClient,
  auth,
  company,
  codesets,
  profile,
  jmf,
};

export default api;
