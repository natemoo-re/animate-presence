export function external() {
  return {
    name: 'stencilExternal',
    resolveId(id: string) {
      if (id.indexOf('@stencil/router') > -1) {
        return {
          id,
          external: true,
          moduleSideEffects: false,
        };
      }
      return null;
    },
  };
}
