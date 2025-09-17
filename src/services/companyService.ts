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
  // GET /company — role-based (superadmin: all, others: own)
  get: async () => {
    const { data } = await api.get<CompanyResponse | CompanyResponse[]>(API_ENDPOINTS.COMPANY.GET);
    return data;
  },
  update: async (payload: UpdateCompanyPayload) => {
    const { data } = await api.put<CompanyResponse>(API_ENDPOINTS.COMPANY.UPDATE, payload);
    return data;
  },
  // PUT /company/{companyId}/update — superadmin only
  updateById: async (companyId: string, payload: UpdateCompanyPayload) => {
    const { data } = await api.put<CompanyResponse>(`company/${companyId}/update`, payload);
    return data;
  },
  uploadLogo: async (file: File) => {
    const form = new FormData();
    form.append("logo", file);
    const { data } = await api.patch<CompanyResponse>(API_ENDPOINTS.COMPANY.LOGO, form, {
      headers: {
        // Let the browser set multipart boundaries (override axios default JSON header)
        'Content-Type': undefined as unknown as string,
      },
    });
    return data;
  },
  // PATCH /company/{companyId}/logo — superadmin only
  uploadLogoById: async (companyId: string, file: File) => {
    const form = new FormData();
    form.append("logo", file);
    const { data } = await api.patch<CompanyResponse>(`company/${companyId}/logo`, form, {
      headers: {
        'Content-Type': undefined as unknown as string,
      },
    });
    return data;
  },
};

export default companyService;
