import React from 'react';

const CustomButton = ({
  children,
  type = 'button',
  className = '',
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  style,
  loading = false,
  ...props
}) => {
  // Define variants
  const variants = {
    primary:
      'w-full py-2 rounded text-white font-medium text-m shadow transition flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed',
    secondary:
      'w-full py-2 rounded text-primary-700 font-medium text-m shadow border border-primary-400 bg-white hover:bg-primary-50 transition flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed',
  };

  const inlineStyles = {
    primary: {
      background:
        'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
      ...style,
    },
    secondary: { ...style },
  };

  return (
    <button
      type={type}
      className={`${variants[variant] || variants.primary} ${className}`}
      style={inlineStyles[variant]}
      disabled={loading || props.disabled}
      {...props}
    >
      {iconPosition === 'left' && Icon && !loading && (
        <Icon className="w-5 h-5 mr-1" />
      )}
      <span>
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          children
        )}
      </span>
      {iconPosition === 'right' && Icon && !loading && (
        <Icon className="w-5 h-5 ml-1" />
      )}
    </button>
  );
};

export default CustomButton;
