import { getTrimmedValue } from "./validation";
import { getFromStorage, removeFromStorage, setToStorage } from "./storage";

const USER_STORAGE_KEY = "best-shop-user";

type UserSession = {
  email: string;
  isLoggedIn: boolean;
  rememberMe: boolean;
};

export function getCurrentUser(): UserSession | null {
  return getFromStorage<UserSession>(USER_STORAGE_KEY);
}

export function isUserLoggedIn(): boolean {
  const user = getCurrentUser();
  return Boolean(user?.isLoggedIn);
}

export function loginUser(email: string, rememberMe = false): UserSession {
  const user: UserSession = {
    email: getTrimmedValue(email),
    isLoggedIn: true,
    rememberMe,
  };

  setToStorage(USER_STORAGE_KEY, user);
  return user;
}

export function logoutUser(): void {
  removeFromStorage(USER_STORAGE_KEY);
}

export type { UserSession };
