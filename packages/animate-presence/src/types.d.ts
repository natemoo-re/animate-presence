declare module "https://*" {
    const exports: any;
    const injectHistory: any;
    export default exports;
    export { injectHistory }
}