import React from 'react';

interface EmptyStateProps {
  type: 'no-results' | 'no-search' | 'error';
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, message, action }: EmptyStateProps) {
  const configs = {
    'no-search': {
      emoji: '🌍',
      title: 'Start Your Flight Search',
      description: 'Enter your origin, destination, and dates to find the best flights',
    },
    'no-results': {
      emoji: '🔍',
      title: 'No flights found',
      description: message || 'No flights match your current filters. Try adjusting your filters or search criteria.',
    },
    error: {
      emoji: '⚠️',
      title: 'Something went wrong',
      description: message || 'Please try again or check your search parameters',
    },
  };

  const config = configs[type];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
      <div className="text-6xl mb-4 animate-bounce">{config.emoji}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {config.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

