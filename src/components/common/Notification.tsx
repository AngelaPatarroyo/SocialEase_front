'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

const notificationStyles = {
  success: {
    bg: 'bg-emerald-600 dark:bg-emerald-700',
    icon: '✓',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-50',
  },
  error: {
    bg: 'bg-rose-600 dark:bg-rose-700',
    icon: '⚠️',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-50',
  },
  warning: {
    bg: 'bg-amber-600 dark:bg-amber-700',
    icon: '⚠️',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-50',
  },
  info: {
    bg: 'bg-slate-600 dark:bg-slate-700',
    icon: 'ℹ️',
    border: 'border-slate-200 dark:border-slate-800',
    text: 'text-slate-50',
  },
};

export default function Notification({ 
  type, 
  title, 
  message, 
  duration, 
  onClose 
}: NotificationProps) {
  // Set appropriate default durations for each notification type
  const getDefaultDuration = () => {
    switch (type) {
      case 'success': return 3000;  // 3 seconds for success
      case 'error': return 5000;    // 5 seconds for errors (user needs time to read)
      case 'warning': return 4000;  // 4 seconds for warnings
      case 'info': return 2500;     // 2.5 seconds for info (like loading states)
      default: return 3000;
    }
  };
  
  const finalDuration = duration || getDefaultDuration();
  const [isVisible, setIsVisible] = useState(true);
  const styles = notificationStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for exit animation
    }, finalDuration);

    return () => clearTimeout(timer);
  }, [finalDuration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 ${styles.bg} ${styles.text} p-4 rounded-xl shadow-lg max-w-sm border ${styles.border} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">{styles.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{title}</h3>
              {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="opacity-70 hover:opacity-100 text-xl font-bold transition-opacity"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility function to show notifications
export const showNotification = (
  type: NotificationType,
  title: string,
  message?: string,
  duration?: number
) => {
  // Set appropriate default durations for each notification type
  const getDefaultDuration = () => {
    switch (type) {
      case 'success': return 3000;  // 3 seconds for success
      case 'error': return 5000;    // 5 seconds for errors
      case 'warning': return 4000;  // 4 seconds for warnings
      case 'info': return 2500;     // 2.5 seconds for info
      default: return 3000;
    }
  };
  
  const finalDuration = duration || getDefaultDuration();
  const notificationId = `notification-${Date.now()}`;
  const styles = notificationStyles[type];
  
                // Create the notification element
              const notification = document.createElement('div');
              notification.id = notificationId;
              notification.className = `fixed top-4 right-4 z-50 ${styles.bg} ${styles.text} p-4 rounded-xl shadow-lg max-w-sm border ${styles.border} backdrop-blur-sm transform transition-all duration-300 ease-out opacity-0 translate-x-full`;
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="text-2xl">${styles.icon}</div>
      <div class="flex-1">
        <h3 class="font-bold text-lg">${title}</h3>
        ${message ? `<p class="text-sm opacity-90 mt-1">${message}</p>` : ''}
      </div>
      <button class="opacity-70 hover:opacity-100 text-xl font-bold transition-opacity" onclick="this.closest('[id^=\\'notification-\\']').remove()">
        ×
      </button>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.classList.remove('opacity-0', 'translate-x-full');
  });
  
  // Auto-remove after duration
  const removeNotification = () => {
    notification.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  };
  
  const timer = setTimeout(removeNotification, finalDuration);
  
  // Allow manual close to clear the timer
  const closeButton = notification.querySelector('button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      clearTimeout(timer);
      removeNotification();
    });
  }
};
