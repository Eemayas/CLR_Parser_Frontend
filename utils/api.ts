/** @format */

import { GrammarStructure } from "@/types";
import { CodeSquare } from "lucide-react";

const BASE_URL = "http://127.0.0.1:5000"; // Replace with your Flask server URL

export const api = {
  async getHome() {
    const response = await fetch(`${BASE_URL}/`, {
      method: "GET",
    });
    return response.json();
  },

  async getApiMessage() {
    const response = await fetch(`${BASE_URL}/api`, {
      method: "GET",
    });
    return response.json();
  },

  async initializeParser(grammar: GrammarStructure) {
    const response = await fetch(`${BASE_URL}/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grammar),
    });
    return response.json();
  },

  async getFirstFollowSets(grammar?: GrammarStructure) {
    const response = await fetch(`${BASE_URL}/first-follow-sets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grammar),
    });
    return response.json();
  },

  async getCanonicalCollection(grammar?: GrammarStructure) {
    const response = await fetch(`${BASE_URL}/canonical_collection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grammar),
    });
    return response.json();
  },

  async getParsingTable(grammar?: GrammarStructure) {
    const response = await fetch(`${BASE_URL}/parsing_tables`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grammar),
    });
    return response.json();
  },
  async getPraseStringResult(grammar: GrammarStructure, inputstr: string) {
    const response = await fetch(`${BASE_URL}/parse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...grammar, input_string: inputstr }),
    });
    return response.json();
  },
};
