"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { postChatMessage } from "../api/chat";
import { ApiError } from "../api/client";
import { useAppDispatch, useAppState } from "../store/context";
import type { ChatMessage } from "../types/domain";

function createMessage(
  role: ChatMessage["role"],
  kind: ChatMessage["kind"],
  content: string,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    kind,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}

export function useChat() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasStarted = useRef(false);
  const lastMessageRef = useRef("");

  const performRequest = useCallback(
    async (text: string) => {
      try {
        const res = await postChatMessage({
          message: text,
          profile: state.profile,
          progress: state.progress,
        });
        const agentMessage = createMessage(
          "agent",
          res.needsClarification ? "clarification" : "text",
          res.reply,
          { quickReplies: res.quickReplies, allowMultiple: res.allowMultiple },
        );
        dispatch({
          type: "SEND_MESSAGE_SUCCESS",
          agentMessage,
          progress: res.progress,
          profile: res.profile,
          isComplete: res.isComplete,
        });
        if (res.isComplete) {
          router.push("/recipes");
        }
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
        dispatch({ type: "SEND_MESSAGE_ERROR", errorMessage: message });
      }
    },
    [dispatch, router, state.profile, state.progress],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      lastMessageRef.current = trimmed;
      const userMessage = trimmed !== "" ? createMessage("user", "text", trimmed) : undefined;
      dispatch({ type: "SEND_MESSAGE_START", message: userMessage });
      void performRequest(trimmed);
    },
    [dispatch, performRequest],
  );

  const retry = useCallback(() => {
    dispatch({ type: "SEND_MESSAGE_START" });
    void performRequest(lastMessageRef.current);
  }, [dispatch, performRequest]);

  const startConversation = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    sendMessage("");
  }, [sendMessage]);

  return { ...state, sendMessage, retry, startConversation };
}
