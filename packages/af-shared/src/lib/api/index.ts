import apiClient from './api-client';
import * as auth from './services/auth';
import * as codesets from './services/codesets';
import * as company from './services/company';
import * as dataspace from './services/dataspace';
import * as employment from './services/employment';
import * as jmf from './services/jmf';
import * as permits from './services/permits';
import * as profile from './services/profile';

const api = {
  client: apiClient,
  auth,
  company,
  codesets,
  profile,
  jmf,
  dataspace,
  permits,
  employment,
};

export default api;
