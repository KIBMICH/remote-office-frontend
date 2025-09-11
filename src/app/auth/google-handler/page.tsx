"use client";

import { useEffect } from "react";

export default function GoogleHandlerPage() {
  useEffect(() => {
    // Try multiple strategies to extract token/user and notify opener
    const notifySuccess = (token: string, user?: unknown) => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
            user,
          },
          window.location.origin
        );
        window.close();
      }
    };

    const notifyError = (message: string) => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: message,
          },
          window.location.origin
        );
        window.close();
      }
    };

    try {
      // 1) Check URL search params
      const url = new URL(window.location.href);
      let token = url.searchParams.get('token') || url.searchParams.get('access_token') || url.searchParams.get('accessToken');

      // 2) Check hash fragment
      if (!token && window.location.hash) {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        token = hash.get('token') || hash.get('access_token') || hash.get('accessToken');
      }

      if (token) {
        notifySuccess(token);
        return;
      }

      // 3) Fallback: parse JSON from page body (some backends return a JSON page)
      const bodyText = document.body.innerText || document.body.textContent || '';
      if (bodyText && bodyText.includes('"token"')) {
        try {
          const data = JSON.parse(bodyText);
          if (data?.token) {
            notifySuccess(data.token as string, (data as { user?: unknown }).user);
            return;
          }
        } catch (e) {
          console.error('Failed to parse Google auth response body as JSON:', e);
          notifyError('Failed to parse authentication response');
          return;
        }
      }

      // If nothing found, report error so the opener can handle it
      notifyError('No authentication token found in callback');
    } catch (e) {
      console.error('Google handler error:', e);
      notifyError('Unexpected error in Google handler');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Processing Google sign-in...</p>
      </div>
    </div>
  );
}

