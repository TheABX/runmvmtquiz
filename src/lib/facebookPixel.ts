// Facebook Pixel tracking utility
declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const trackFacebookEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

// Convenience functions for common events
export const trackPurchase = (value?: number, currency: string = 'AUD') => {
  trackFacebookEvent('Purchase', {
    value: value,
    currency: currency,
  });
};

export const trackLead = (contentName?: string) => {
  trackFacebookEvent('Lead', {
    content_name: contentName || 'Quiz Completion',
  });
};

export const trackCompleteRegistration = () => {
  trackFacebookEvent('CompleteRegistration');
};

export const trackAddToCart = (value?: number, currency: string = 'AUD') => {
  trackFacebookEvent('AddToCart', {
    value: value,
    currency: currency,
    content_name: 'RUN MVMT — Premium Training System',
  });
};

export const trackInitiateCheckout = (value?: number, currency: string = 'AUD') => {
  trackFacebookEvent('InitiateCheckout', {
    value: value,
    currency: currency,
    content_name: 'RUN MVMT — Premium Training System',
  });
};

export const trackViewContent = (contentName: string, contentType?: string) => {
  trackFacebookEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType || 'quiz',
  });
};

