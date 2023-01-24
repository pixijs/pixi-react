"use strict";(self.webpackChunk_pixi_react_docs=self.webpackChunk_pixi_react_docs||[]).push([[713],{2519:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var r=n(7896),a=(n(2784),n(3905));const i={},o="AnimatedSprite",l={unversionedId:"components/AnimatedSprite",id:"components/AnimatedSprite",title:"AnimatedSprite",description:"Props",source:"@site/docs/components/AnimatedSprite.mdx",sourceDirName:"components",slug:"/components/AnimatedSprite",permalink:"/components/AnimatedSprite",draft:!1,editUrl:"https://github.com/pixijs/pixi-react/tree/master/packages/docs/docs/components/AnimatedSprite.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"About",permalink:"/"},next:{title:"BitmapText",permalink:"/components/BitmapText"}},p={},m=[{value:"Props",id:"props",level:2},{value:"Additional Props",id:"additional-props",level:3},{value:"Usage",id:"usage",level:2},{value:"Example",id:"example",level:2}],d={toc:m};function s(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"animatedsprite"},"AnimatedSprite"),(0,a.kt)("h2",{id:"props"},"Props"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html"},"https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html")),(0,a.kt)("h3",{id:"additional-props"},"Additional Props"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Prop"),(0,a.kt)("th",{parentName:"tr",align:null},"Default Value"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"textures ",(0,a.kt)("inlineCode",{parentName:"td"},"array")),(0,a.kt)("td",{parentName:"tr",align:null}),(0,a.kt)("td",{parentName:"tr",align:null},"Generate the animated sprite from the textures")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"images ",(0,a.kt)("inlineCode",{parentName:"td"},"array")),(0,a.kt)("td",{parentName:"tr",align:null}),(0,a.kt)("td",{parentName:"tr",align:null},"Generate the animated sprite directly from the images")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"isPlaying ",(0,a.kt)("inlineCode",{parentName:"td"},"boolean")),(0,a.kt)("td",{parentName:"tr",align:null},"true"),(0,a.kt)("td",{parentName:"tr",align:null},"whether the animation starts automatically")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"initialFrame ",(0,a.kt)("inlineCode",{parentName:"td"},"integer")),(0,a.kt)("td",{parentName:"tr",align:null},"0"),(0,a.kt)("td",{parentName:"tr",align:null},"Which frame the animation starts from")))),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:"live noInline",live:!0,noInline:!0},"const textures = makeAnimatedSpriteTextures();\n\nrender(\n  <Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>\n    <Container position={[150, 150]}>\n      <AnimatedSprite\n        anchor={0.5}\n        textures={textures}\n        isPlaying={true}\n        initialFrame={0}\n        animationSpeed={0.1}\n      />\n    </Container>\n  </Stage>,\n);\n")),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("iframe",{height:500,scrolling:"no",title:"Rope",src:"//codepen.io/inlet/embed/ewdXEY/?height=300&theme-id=33987&default-tab=result&embed-version=2",frameBorder:"no",allowFullScreen:!0,style:{width:"100%"}}))}s.isMDXComponent=!0},3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),m=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=m(e.components);return r.createElement(p.Provider,{value:t},e.children)},s="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),s=m(n),u=a,f=s["".concat(p,".").concat(u)]||s[u]||c[u]||i;return n?r.createElement(f,o(o({ref:t},d),{},{components:n})):r.createElement(f,o({ref:t},d))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[s]="string"==typeof e?e:a,o[1]=l;for(var m=2;m<i;m++)o[m]=n[m];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);