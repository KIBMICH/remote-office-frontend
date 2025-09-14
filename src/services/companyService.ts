import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";

export type UpdateCompanyPayload = {
  name?: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  country?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  billingCycle?: string;
};

export type CompanyResponse = {
  id?: string;
  name: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  country?: string;
};

export const companyService = {
  update: async (payload: UpdateCompanyPayload) => {
    const { data } = await api.put<CompanyResponse>(API_ENDPOINTS.COMPANY.UPDATE, payload);
    return data;
  },
  uploadLogo: async (file: File) => {
    const form = new FormData();
    form.append("logo", file);
    const { data } = await api.patch<CompanyResponse>(API_ENDPOINTS.COMPANY.LOGO, form, {
      headers: { /* let browser set Content-Type boundary automatically */ },
    });
    return data;
  },
};

export default companyService;
