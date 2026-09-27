// Lets Node run the app's own modules directly: src/ imports "./cycle", Vite-style, with no
// extension, so this hook retries a missing relative import with ".ts" added.
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (err) {
      if (specifier.startsWith('.') && !specifier.endsWith('.ts')) return next(`${specifier}.ts`, context);
      throw err;
    }
  },
});
