import type { Options } from "@ryoppippi/unplugin-typia";
import TypiaUnplugin from "@ryoppippi/unplugin-typia/rspack";

class TypiaRspackPlugin {
  #plugin: ReturnType<typeof TypiaUnplugin>;

  constructor(options?: Options) {
    this.#plugin = TypiaUnplugin(options);
  }

  apply(compiler: any): void {
    this.#plugin.apply(compiler);
  }
}

export { TypiaRspackPlugin };
export default TypiaRspackPlugin;
