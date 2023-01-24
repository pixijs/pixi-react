"use strict";(self.webpackChunk_pixi_react_pixi_docs=self.webpackChunk_pixi_react_pixi_docs||[]).push([[343],{7010:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var n=r(7896),i=(r(2784),r(3905));const a={},o="withFilters",l={unversionedId:"hoc/with-filters",id:"hoc/with-filters",title:"withFilters",description:"Wrap your ReactPixi component with withFilters to control filter params via props.",source:"@site/docs/hoc/with-filters.mdx",sourceDirName:"hoc",slug:"/hoc/with-filters",permalink:"/docs/hoc/with-filters",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/hoc/with-filters.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Fallback to Canvas",permalink:"/docs/fallback-to-canvas"},next:{title:"Hooks",permalink:"/docs/hooks/"}},c={},p=[{value:"Example",id:"example",level:2}],s={toc:p};function u(e){let{components:t,...r}=e;return(0,i.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"withfilters"},"withFilters"),(0,i.kt)("p",null,"Wrap your ReactPixi component with ",(0,i.kt)("inlineCode",{parentName:"p"},"withFilters")," to control filter params via props."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},"import { AdjustmentFilter } from '@pixi/filter-adjustment';\nimport { Container } from '@pixi/react-pixi';\n\nconst Filters = withFilters(Container, {\n  blur: PIXI.filters.BlurFilter,\n  adjust: AdjustmentFilter,\n});\n\nconst App = () => (\n  <Stage>\n    <Filters scale={2} blur={{ blur: 5 }} adjust={{ gamma: 3, brightness: 5 }}>\n      <Sprite image=\"./image.png\" />\n    </Filters>\n  </Stage>\n);\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Noticed the ",(0,i.kt)("inlineCode",{parentName:"p"},"scale")," prop? All props are passed down to the wrapper component except for the filter props (indexed keys provided in the second argument of ",(0,i.kt)("inlineCode",{parentName:"p"},"withFilters"),"). It basically renders a ",(0,i.kt)("inlineCode",{parentName:"p"},"<Container scale={2} filters=[...]>"),".")),(0,i.kt)("p",null,"For filters that expose methods, you can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"apply")," prop that is called with an object containing all filter instances passed"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},"import { Container } from '@pixi/react-pixi';\n\nconst Filters = withFilters(Container, {\n  matrix: PIXI.filters.ColorMatrixFilter,\n});\n\nconst App = () => (\n  <Stage>\n    <Filters\n      matrix={{ enabled: true }}\n      apply={({ matrix }) => matrix.greyscale()}\n    >\n      <Sprite image=\"./image.png\" />\n    </Filters>\n  </Stage>\n);\n")),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("iframe",{height:500,scrolling:"no",title:"Tiling Sprite",src:"//codepen.io/inlet/embed/qBEGXvv/?height=300&theme-id=33987&default-tab=result&embed-version=2",frameBorder:"no",allowFullScreen:!0,style:{width:"100%"}}),(0,i.kt)("iframe",{height:500,scrolling:"no",title:"Tiling Sprite",src:"//codepen.io/inlet/embed/37ab46cc29a225ec30cd1511285abbc5/?height=300&theme-id=33987&default-tab=result&embed-version=2",frameBorder:"no",allowFullScreen:!0,style:{width:"100%"}}))}u.isMDXComponent=!0},3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var n=r(2784);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(r),d=i,f=u["".concat(c,".").concat(d)]||u[d]||m[d]||a;return r?n.createElement(f,o(o({ref:t},s),{},{components:r})):n.createElement(f,o({ref:t},s))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);