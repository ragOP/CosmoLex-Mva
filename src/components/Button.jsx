import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  type = "button",
  className = "",
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  style,
  ...props
}) => {
  // Define variants
  const variants = {
    primary:
      "w-full py-2 rounded text-white font-medium text-m shadow transition flex items-center justify-center gap-2",
    secondary:
      "w-full py-2 rounded text-primary-700 font-medium text-m shadow border border-primary-400 bg-white hover:bg-primary-50 transition flex items-center justify-center gap-2",
    // Add more variants as needed
  };

  // Define inline styles for variants
  const inlineStyles = {
    primary: {
      background:
        "linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)",
      ...style,
    },
    secondary: { ...style },
  };

  return (
    <button
      type={type}
      className={`${variants[variant] || variants.primary} ${className}`}
      style={inlineStyles[variant]}
      {...props}
    >
      {iconPosition === "left" && Icon && <Icon className="w-5 h-5 mr-1" />}
      <span>{children}</span>
      {iconPosition === "right" && Icon && <Icon className="w-5 h-5 ml-1" />}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  style: PropTypes.object,
};

export default Button;
