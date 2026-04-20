import React, { useMemo } from "react";

interface ChatAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ChatAvatar: React.FC<ChatAvatarProps> = ({
  name = "User",
  size = "md",
  className = "",
}) => {
  // Get initials from name
  const initials = useMemo(() => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, [name]);

  // Generate color based on name (deterministic)
  const backgroundColor = useMemo(() => {
    let hash = 0;
    const str = name || "user";
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 55%)`;
  }, [name]);

  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white shadow-sm ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default ChatAvatar;
