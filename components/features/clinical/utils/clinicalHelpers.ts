export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
    case "active":
      return "bg-green-100 text-green-800";
    case "in progress":
    case "on hold":
      return "bg-yellow-100 text-yellow-800";
    case "ordered":
    case "provisional":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
    case "discontinued":
    case "inactive":
      return "bg-red-100 text-red-800";
    case "resolved":
      return "bg-emerald-100 text-emerald-800";
    case "chronic":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "stat":
      return "bg-red-100 text-red-800 border-red-200";
    case "urgent":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "routine":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "severe":
      return "bg-red-100 text-red-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "mild":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
