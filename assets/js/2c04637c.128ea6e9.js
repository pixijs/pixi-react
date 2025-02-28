"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["427"],{672:function(e,n,i){i.r(n),i.d(n,{default:()=>m,frontMatter:()=>a,metadata:()=>s,assets:()=>p,toc:()=>c,contentTitle:()=>l});var s=JSON.parse('{"id":"components/SimpleMesh","title":"SimpleMesh","description":"Props","source":"@site/versioned_docs/version-7.x/components/SimpleMesh.mdx","sourceDirName":"components","slug":"/components/SimpleMesh","permalink":"/pixi-react/7.x/components/SimpleMesh","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/pixi-react/tree/main/docs/versioned_docs/version-7.x/components/SimpleMesh.mdx","tags":[],"version":"7.x","frontMatter":{},"sidebar":"guides","previous":{"title":"ParticleContainer","permalink":"/pixi-react/7.x/components/ParticleContainer"},"next":{"title":"SimpleRope","permalink":"/pixi-react/7.x/components/SimpleRope"}}'),t=i("4246"),r=i("980"),o=i("482");let a={},l="SimpleMesh",p={},c=[{value:"Props",id:"props",level:2},{value:"Usage",id:"usage",level:2},{value:"Example",id:"example",level:2}];function h(e){let n={a:"a",h1:"h1",h2:"h2",header:"header",p:"p",...(0,r.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"simplemesh",children:"SimpleMesh"})}),"\n",(0,t.jsx)(n.h2,{id:"props",children:"Props"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://pixijs.download/v7.x/docs/PIXI.SimpleMesh.html",children:"https://pixijs.download/v7.x/docs/PIXI.SimpleMesh.html"})}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsx)(o.k,{version:"v7",files:{"App.js":"import { Stage, SimpleMesh } from '@pixi/react';\nimport { DRAW_MODES } from 'pixi.js';\nimport makeSimpleMeshData from './makeSimpleMeshData';\n\nconst { uvs, vertices, indices } = makeSimpleMeshData();\n\nexport default function SimpleMeshExample() {\n    return (\n        <Stage width={500} height={300} options={{ backgroundColor: 0xeef1f5 }}>\n            <SimpleMesh\n                image='https://pixijs.io/pixi-react/img/mesh-placeholder.png'\n                uvs={uvs}\n                vertices={vertices}\n                indices={indices}\n                drawMode={DRAW_MODES.TRIANGLES}\n            />\n        </Stage>\n    );\n}\n","makeSimpleMeshData.js":"export default function makeSimpleMeshData()\n{\n    const w = 500;\n    const h = 300;\n\n    const indices = new Uint16Array([0, 3, 4, 0, 1, 4, 1, 2, 4, 2, 4, 5, 3, 4, 6, 4, 6, 7, 4, 7, 8, 4, 5, 8]);\n\n    const uvs = new Float32Array([0, 0, 0.5, 0, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 0.5, 1, 1, 1]);\n\n    const vertices = new Float32Array([0, 0, w / 2, 0, w, 0, 0, h / 2, w / 2, h / 2, w, h / 2, 0, h, w / 2, h, w, h]);\n\n    return {\n        indices,\n        uvs,\n        vertices,\n    };\n}\n"}}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)("iframe",{height:500,scrolling:"no",title:"Mesh",src:"//codepen.io/inlet/embed/69e7153234c4e01232a7dbc50bbceb40/?height=300&theme-id=33987&default-tab=result&embed-version=2",frameBorder:"no",allowFullScreen:!0,style:{width:"100%"}})]})}function m(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}}}]);