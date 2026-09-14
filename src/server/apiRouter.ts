import { IncomingMessage, ServerResponse } from 'http';
import {
  handleSendOtp,
  handleVerifyOtp,
  handleCompleteRegistration,
  handleLogin,
  handleLogout,
  handleGetSession
} from './authBackend';
import { verifyEmailServiceHealth, sendDevelopmentTestEmail } from './emailService';
import { handleGetPublicProfile, handleCheckUsernameAvailability } from './userBackend';
import {
  handleStartAssessment,
  handleRecordViolation,
  handleSubmitAssessment,
  handleGetAssessmentSession
} from './assessmentBackend';
import {
  handleBackendCreateOrder,
  handleBackendVerifyPayment,
  handleBackendWebhook,
  getBackendPaymentConfig
} from './paymentBackend';

/**
 * Helper to parse JSON body from incoming HTTP request
 */
export const parseJsonBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(bodyStr);
        resolve(parsed);
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
};

/**
 * Helper to send JSON response
 */
export const sendJsonResponse = (res: ServerResponse, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

/**
 * Main API Request Dispatcher for Vite & Node HTTP Server
 */
export const handleApiRequest = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> => {
  const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method?.toUpperCase() || 'GET';

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  try {
    // ----------------------------------------------------
    // AUTH & DEV EMAIL ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/auth/send-otp' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleSendOtp(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/auth/verify-otp' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleVerifyOtp(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/auth/complete-registration' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleCompleteRegistration(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleLogin(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      const result = await handleLogout();
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/auth/email-health' && method === 'GET') {
      const health = await verifyEmailServiceHealth();
      sendJsonResponse(res, health.verified ? 200 : 503, health);
      return true;
    }

    // Development Diagnostic Test Email (Item 6)
    if ((pathname === '/api/dev/test-email' || pathname === '/api/auth/test-email') && method === 'POST') {
      const body = await parseJsonBody(req);
      const recipient = body.recipientEmail || body.email;
      if (!recipient) {
        sendJsonResponse(res, 400, { error: 'recipientEmail is required' });
        return true;
      }
      const result = await sendDevelopmentTestEmail(recipient, body.name || 'Developer');
      sendJsonResponse(res, result.success ? 200 : 503, {
        success: result.success,
        message: result.success ? 'Email service test successful.' : result.error,
        messageId: result.messageId,
        provider: result.provider,
        error: result.error
      });
      return true;
    }

    if (pathname === '/api/auth/session' && method === 'GET') {
      const authHeader = req.headers['authorization'] as string;
      const result = await handleGetSession(authHeader);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    // ----------------------------------------------------
    // USER & PUBLIC PROFILE ROUTES
    // ----------------------------------------------------
    // GET /api/users/:uniqueUserId/public-profile
    const publicProfileMatch = pathname.match(/^\/api\/users\/([^/]+)\/public-profile\/?$/);
    if (publicProfileMatch && method === 'GET') {
      const uniqueUserId = decodeURIComponent(publicProfileMatch[1]);
      const result = await handleGetPublicProfile(uniqueUserId);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    // GET /api/users/check-username/:uniqueUserId
    const checkUsernameMatch = pathname.match(/^\/api\/users\/check-username\/([^/]+)\/?$/);
    if (checkUsernameMatch && method === 'GET') {
      const uniqueUserId = decodeURIComponent(checkUsernameMatch[1]);
      const result = await handleCheckUsernameAvailability(uniqueUserId);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    // ----------------------------------------------------
    // ASSESSMENT ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/assessments/start' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleStartAssessment(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/assessments/violation' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleRecordViolation(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    if (pathname === '/api/assessments/submit' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleSubmitAssessment(body);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    // GET /api/assessments/session/:sessionId
    const sessionMatch = pathname.match(/^\/api\/assessments\/session\/([^/]+)\/?$/);
    if (sessionMatch && method === 'GET') {
      const sessionId = decodeURIComponent(sessionMatch[1]);
      const result = await handleGetAssessmentSession(sessionId);
      sendJsonResponse(res, result.status, result.data);
      return true;
    }

    // ----------------------------------------------------
    // PAYMENT ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/payments/config' && method === 'GET') {
      const config = getBackendPaymentConfig();
      sendJsonResponse(res, 200, {
        keyId: config.keyId,
        planPriceINR: config.planPriceINR,
        amountInPaise: config.amountInPaise,
        currency: config.currency,
        mode: config.mode,
        isRealKeysConfigured: config.isRealKeysConfigured
      });
      return true;
    }

    if (pathname === '/api/payments/create-order' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleBackendCreateOrder(body);
      sendJsonResponse(res, 200, result);
      return true;
    }

    if (pathname === '/api/payments/verify' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await handleBackendVerifyPayment(body);
      sendJsonResponse(res, 200, result);
      return true;
    }

    if (pathname === '/api/payments/webhook' && method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', async () => {
        const signature = (req.headers['x-razorpay-signature'] as string) || '';
        const result = await handleBackendWebhook(bodyStr, signature);
        sendJsonResponse(res, 200, result);
      });
      return true;
    }

    // Unknown API route
    sendJsonResponse(res, 404, { error: `API endpoint '${pathname}' not found.` });
    return true;

  } catch (error: any) {
    console.error('[API Router Error]:', error);
    sendJsonResponse(res, 500, {
      error: 'An internal server error occurred while processing your request.',
      message: error?.message || 'Server error'
    });
    return true;
  }
};
