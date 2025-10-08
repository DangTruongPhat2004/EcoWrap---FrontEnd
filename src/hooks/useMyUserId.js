// src/hooks/useMyUserId.js
import { useMemo } from "react";
import { getUserIdFromJwt } from "../utils/jwt";

function getLsToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function getLsUserId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const obj = JSON.parse(raw);
    const id = obj?.userId;
    return Number.isFinite(Number(id)) ? Number(id) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve myUserId without calling /me.
 * Priority: prop myUserIdProp > decode JWT (localStorage "token") > localStorage "user" > fallback
 */
export function useMyUserId({ getToken, fallbackUserId, myUserIdProp } = {}) {
  const myUserId = useMemo(() => {
    if (Number.isFinite(Number(myUserIdProp))) return Number(myUserIdProp);

    // 1) get token from custom getter
    let token = typeof getToken === "function" ? getToken() : undefined;

    // 2) if not, try localStorage("token")
    if (!token) token = getLsToken();

    // 3) decode from JWT
    const fromJwt = token ? getUserIdFromJwt(token) : undefined;
    if (Number.isFinite(Number(fromJwt))) return Number(fromJwt);

    // 4) localStorage("user")
    const fromUser = getLsUserId();
    if (Number.isFinite(Number(fromUser))) return Number(fromUser);

    // 5) fallback
    return fallbackUserId;
  }, [getToken, fallbackUserId, myUserIdProp]);

  return { myUserId };
}
