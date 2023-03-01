import type { Body, ContactEquation } from "cannon-es";

import type { IncomingWorkerMessage } from "../types";

export type WithUUID<C> = C & { uuid?: string };

/** @category DOM APIs */
export type Transferable = ArrayBuffer | MessagePort;

/**
 * This type has been renamed to StructuredSerializeOptions. Use that type for
 * new code.
 *
 * @deprecated use `StructuredSerializeOptions` instead.
 * @category DOM APIs
 */
export type PostMessageOptions = StructuredSerializeOptions;

/** @category DOM APIs from lib.deno.d.ts*/
export interface StructuredSerializeOptions {
  transfer?: Transferable[];
}

export interface CannonWorkerGlobalScope extends ServiceWorkerGlobalScope {
  postMessage(
    message: IncomingWorkerMessage["data"],
    transfer: Transferable[]
  ): void;
  postMessage(
    message: IncomingWorkerMessage["data"],
    options?: StructuredSerializeOptions
  ): void;
}

export interface CannonCollideEvent {
  body: WithUUID<Body>;
  contact: ContactEquation;
  target: WithUUID<Body>;
  type: "collide";
}
