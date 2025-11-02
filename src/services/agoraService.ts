import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  RtcTokenResponse,
  RtmTokenResponse,
  RoomAccessResponse,
  GenerateRtcTokenPayload,
  GenerateRtmTokenPayload,
} from "@/types/agora";

/**
 * Agora Service
 * Handles all Agora-related API operations including token generation and room validation
 */

// Token Generation
export const generateRtcToken = async (
  payload: GenerateRtcTokenPayload
): Promise<RtcTokenResponse> => {
  const response = await api.post<RtcTokenResponse>(API_ENDPOINTS.AGORA.RTC_TOKEN, payload);
  return response.data;
};

export const generateRtmToken = async (
  payload: GenerateRtmTokenPayload
): Promise<RtmTokenResponse> => {
  const response = await api.post<RtmTokenResponse>(API_ENDPOINTS.AGORA.RTM_TOKEN, payload);
  return response.data;
};

// Room Validation
export const validateRoomAccess = async (roomName: string): Promise<RoomAccessResponse> => {
  const endpoint = API_ENDPOINTS.AGORA.VALIDATE_ROOM.replace(":roomName", roomName);
  const response = await api.get<RoomAccessResponse>(endpoint);
  return response.data;
};

// Export as default service object for backward compatibility
export const agoraService = {
  generateRtcToken,
  generateRtmToken,
  validateRoomAccess,
};

export default agoraService;


