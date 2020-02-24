import { Config } from '@stencil/core';
import { external } from "./plugin-externals";


export const config: Config = {
         namespace: "animate-presence",
         copy: [{ src: "static" }],
         plugins: [external()],
         outputTargets: [
           {
             type: "dist",
             esmLoaderPath: "../loader"
           },
           {
             type: "docs-readme"
           },
           {
             type: "www",
             serviceWorker: null
           }
         ]
       };
