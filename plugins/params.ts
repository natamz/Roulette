import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

export default function (context: Context, inject: Inject): void {
  const params = {
    rotationTime: 8000,
  };
  inject("params", params);
}
