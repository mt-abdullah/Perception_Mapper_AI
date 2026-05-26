export const HARDCODED_ADMINS = [
  { email: "admin1@perception.ai", password: "Admin@123", name: "System Admin One" },
  { email: "admin2@perception.ai", password: "Admin@456", name: "System Admin Two" },
];

export type SubscriptionTier = "FREE" | "BASIC" | "PRO";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  avatarUrl: string;
  tier: SubscriptionTier;
}

export const getMockSession = (): { isSignedIn: boolean; user: MockUser | null } => {
  if (typeof window === "undefined") return { isSignedIn: false, user: null };

  const isSignedIn = localStorage.getItem("pm_mock_signed_in") === "true";
  if (!isSignedIn) return { isSignedIn: false, user: null };

  const email = localStorage.getItem("pm_mock_user_email") || "user@example.com";
  const role = (localStorage.getItem("pm_mock_user_rbac_role") || "USER") as "USER" | "ADMIN";
  const name = localStorage.getItem("pm_mock_user_name") || "Standard User";
  const id = localStorage.getItem("pm_mock_user_id") || "mock-id";
  const tier = (localStorage.getItem("pm_mock_user_tier") || "FREE") as SubscriptionTier;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b0764&color=c084fc`;

  return {
    isSignedIn,
    user: { id, email, name, role, avatarUrl, tier },
  };
};

export const setMockSession = (email: string, role: "USER" | "ADMIN", name: string, tier: SubscriptionTier = "FREE") => {
  if (typeof window === "undefined") return;

  const id = "mock-" + Math.random().toString(36).substring(2, 9);
  localStorage.setItem("pm_mock_signed_in", "true");
  localStorage.setItem("pm_mock_user_id", id);
  localStorage.setItem("pm_mock_user_email", email);
  localStorage.setItem("pm_mock_user_rbac_role", role);
  localStorage.setItem("pm_mock_user_name", name);
  localStorage.setItem("pm_mock_user_tier", tier);

  if (role === "ADMIN") {
    localStorage.setItem("pm_mock_admin_session", "true");
    document.cookie = "pm_mock_admin_session=true; path=/";
  }

  document.cookie = "pm_mock_signed_in=true; path=/";
};

export const clearMockSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("pm_mock_signed_in");
  localStorage.removeItem("pm_mock_user_id");
  localStorage.removeItem("pm_mock_user_email");
  localStorage.removeItem("pm_mock_user_rbac_role");
  localStorage.removeItem("pm_mock_user_name");
  localStorage.removeItem("pm_mock_user_tier");
  localStorage.removeItem("pm_mock_admin_session");

  document.cookie = "pm_mock_signed_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "pm_mock_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const validateAdminCredentials = (email: string, pass: string): { success: boolean; name: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const admin = HARDCODED_ADMINS.find((a) => a.email === cleanEmail && a.password === pass);
  if (admin) {
    return { success: true, name: admin.name };
  }
  return { success: false, name: "" };
};
