import type { transform as typiaTransform } from "typia/lib/transform";

type RuleCondition = string | RegExp | ((value: string) => boolean) | RuleCondition[];

type TypiaOptions = Parameters<typeof typiaTransform>[1];

export type Options = {
  /**
   * The files to transform.
   *
   * @default [/\.[cm]?[jt]sx?$/]
   */
  include?: RuleCondition;

  /**
   * The files to skip.
   *
   * @default [/node_modules/]
   */
  exclude?: RuleCondition;

  /**
   * Adjusts the Rspack loader order.
   *
   * @default "pre"
   */
  enforce?: "pre" | "post";

  /**
   * The path to the tsconfig file.
   */
  tsconfig?: string;

  /**
   * Options forwarded to Typia's transformer.
   */
  typia?: TypiaOptions;
};

export type LoaderOptions = Pick<Options, "tsconfig" | "typia">;

export const DEFAULT_INCLUDE = [/\.[cm]?[jt]sx?$/];
export const DEFAULT_EXCLUDE = [/node_modules/];
