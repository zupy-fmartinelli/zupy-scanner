import{r as h,j as e,i as v,a as N,u as w,e as y,y as g}from"./main-C-q4ut4N.js";import{Z as k}from"./pwa-scanner-branco-oh03E7i6.js";function C(){const[u,s]=h.useState(!1),[t,l]=h.useState(null);h.useEffect(()=>{const o=()=>{if(v()||window.matchMedia("(display-mode: standalone)").matches){s(!1);return}const n=localStorage.getItem("pwa_prompt_dismissed");if(n){const p=parseInt(n,10),b=Date.now(),c=24*60*60*1e3;if(b-p<c){s(!1);return}}s(!0)},r=n=>{n.preventDefault(),l(n),o()},m=()=>{s(!1),l(null),localStorage.setItem("pwa_installed","true")};return window.addEventListener("beforeinstallprompt",r),window.addEventListener("appinstalled",m),o(),()=>{window.removeEventListener("beforeinstallprompt",r),window.removeEventListener("appinstalled",m)}},[]);const a=async()=>{if(!t){console.log("Prompt de instalação não disponível");return}t.prompt();const{outcome:o}=await t.userChoice;console.log(`Usuário escolheu: ${o}`),l(null),o==="dismissed"&&localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)},d=()=>{localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)};return u?e.jsxs("div",{className:"pwa-install-prompt shadow-lg",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"pwa-install-icon",children:e.jsx("i",{className:"bi bi-download text-primary"})}),e.jsxs("div",{className:"pwa-install-text flex-grow-1",children:[e.jsx("strong",{children:"Instale o Scanner Zupy"}),e.jsx("p",{className:"mb-0 small",children:"Melhor desempenho e acesso offline"})]}),e.jsxs("div",{className:"pwa-install-actions",children:[e.jsx("button",{className:"btn btn-sm btn-primary me-2",onClick:a,children:"Instalar"}),e.jsx("button",{className:"btn btn-sm btn-link text-muted",onClick:d,"aria-label":"Fechar",children:e.jsx("i",{className:"bi bi-x"})})]})]}),e.jsx("style",{jsx:!0,children:`
        .pwa-install-prompt {
          position: fixed;
          bottom: 80px; /* Acima do menu de navegação */
          left: 10px;
          right: 10px;
          background-color: var(--app-bg-card-light);
          color: var(--app-text-light);
          padding: 12px 16px;
          z-index: 1030; /* Maior que o rodapé (1020) */
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
          animation: slide-up 0.3s ease-out;
        }
        
        .pwa-install-icon {
          font-size: 1.8rem;
          margin-right: 12px;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `})]}):null}function I({title:u,children:s,activeMenu:t}){const l=N(),{userData:a,scannerData:d,logout:o}=w(),{isOnline:r,syncData:m,isSyncing:n,pendingCount:p}=y(),[b,c]=h.useState(!1),x=i=>{l(i)},f=async()=>{const i=await m();i.synced>0?g.success(`${i.synced} itens sincronizados com sucesso`):i.pending===0&&i.failed===0?g.info("Nenhum item pendente para sincronização"):i.failed>0&&g.error(`${i.failed} itens com falha de sincronização`)},j=async()=>{await o(),l("/auth")};return e.jsxs("div",{className:"d-flex flex-column min-vh-100 bg-light",children:[e.jsx("header",{className:"bg-dark text-white shadow-sm",children:e.jsx("div",{className:"container-fluid",children:e.jsxs("div",{className:"d-flex align-items-center py-2",children:[e.jsx("img",{src:k,alt:"Zupy",className:"me-2",style:{height:"32px"}}),e.jsx("h1",{className:"h5 mb-0 flex-grow-1",children:u}),e.jsxs("div",{className:"d-flex align-items-center me-2",children:[e.jsx("span",{className:`badge ${r?"bg-success":"bg-danger"} me-2`,children:r?"Online":"Offline"}),p>0&&e.jsxs("span",{className:"badge bg-warning me-2",children:[e.jsx("i",{className:"bi bi-clock-history me-1"}),p]})]}),e.jsxs("button",{className:"btn btn-sm btn-outline-light me-2",onClick:f,disabled:n||!r,children:[n?e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}):e.jsx("i",{className:"bi bi-arrow-repeat"}),e.jsx("span",{className:"visually-hidden",children:"Sincronizar"})]}),e.jsxs("div",{className:"dropdown",children:[e.jsxs("button",{className:"btn btn-sm btn-dark dropdown-toggle",type:"button",id:"userMenuButton","data-bs-toggle":"dropdown","aria-expanded":"false",children:[e.jsx("i",{className:"bi bi-person-circle me-1"}),e.jsx("span",{className:"d-none d-md-inline",children:(a==null?void 0:a.name)||"Usuário"})]}),e.jsxs("ul",{className:"dropdown-menu dropdown-menu-end","aria-labelledby":"userMenuButton",children:[e.jsxs("li",{className:"px-3 py-2 text-muted small",children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("strong",{children:"Operador:"})," ",(a==null?void 0:a.name)||"Não identificado"]}),(d==null?void 0:d.name)&&e.jsxs("div",{children:[e.jsx("strong",{children:"Scanner:"})," ",d.name]})]}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider my-1"})}),e.jsx("li",{children:e.jsxs("button",{className:"dropdown-item",onClick:()=>x("/settings"),children:[e.jsx("i",{className:"bi bi-gear me-2"}),"Configurações"]})}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider"})}),e.jsx("li",{children:e.jsxs("button",{className:"dropdown-item text-danger",onClick:()=>c(!0),children:[e.jsx("i",{className:"bi bi-box-arrow-right me-2"}),"Sair"]})})]})]})]})})}),e.jsx("main",{className:"flex-grow-1 bg-dark text-white pb-5",children:s}),e.jsx(C,{}),e.jsxs("footer",{className:"bg-dark text-white border-top shadow-lg fixed-bottom",style:{zIndex:1020},children:[e.jsx("div",{className:"container-fluid",children:e.jsxs("nav",{className:"nav-bar",children:[e.jsx("button",{className:`nav-item ${t==="history"?"active":""}`,onClick:()=>x("/history"),"aria-label":"Histórico",children:e.jsx("i",{className:"bi bi-clock-history"})}),e.jsx("button",{className:"nav-item-center",onClick:()=>x("/scanner"),children:e.jsx("div",{className:`scan-button-circle ${t==="scanner"?"active":""}`,children:e.jsx("i",{className:"bi bi-qr-code-scan"})})}),e.jsx("button",{className:`nav-item ${t==="settings"?"active":""}`,onClick:()=>x("/settings"),"aria-label":"Configurações",children:e.jsx("i",{className:"bi bi-gear"})})]})}),e.jsx("style",{jsx:!0,children:`
          .nav-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 4px 0; /* Reduzido padding vertical */
          }
          
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: transparent;
            border: none;
            color: #adb5bd;
            padding: 6px 12px; /* Reduzido padding */
            cursor: pointer;
            transition: color 0.2s;
            flex: 1;
            /* font-size: 0.75rem; */ /* Font size not needed if text is removed */
          }
          
          .nav-item i {
            font-size: 1.5rem; /* Aumentar um pouco o ícone lateral sem texto */
            /* margin-bottom: 3px; */ /* Margin not needed if text is removed */
          }
          
          .nav-item.active {
            color: white;
          }
          
          .nav-item:hover {
            color: white;
          }
          
          .nav-item-center {
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            border: none;
            padding: 0;
            transform: translateY(-25px); /* Aumentado deslocamento para "sair" mais */
            position: relative;
            z-index: 1030;
            flex: 1;
          }
          
          .scan-button-circle {
            width: 70px; /* Aumentado tamanho */
            height: 70px; /* Aumentado tamanho */
            border-radius: 50%;
            background-color: var(--bs-success); /* Mudado para verde Bootstrap */
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Aumentado sombra */
            transition: all 0.3s ease;
            border: 3px solid var(--bs-dark); /* Adiciona borda para destacar do fundo */
          }
          
          .scan-button-circle i {
            font-size: 2.2rem; /* Aumentado tamanho do ícone */
          }
          
          .scan-button-circle.active, 
          .scan-button-circle:hover {
            background-color: #157347; /* Verde mais escuro no hover */
            transform: scale(1.08) translateY(-2px); /* Efeito de hover mais pronunciado */
          }
        `})]}),b&&e.jsxs("div",{className:"modal fade show",style:{display:"block"},tabIndex:"-1",children:[e.jsx("div",{className:"modal-dialog modal-dialog-centered",children:e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h5",{className:"modal-title",children:"Confirmação"}),e.jsx("button",{type:"button",className:"btn-close",onClick:()=>c(!1)})]}),e.jsxs("div",{className:"modal-body",children:[e.jsx("p",{children:"Tem certeza que deseja sair do aplicativo?"}),!r&&e.jsx("div",{className:"alert alert-warning",role:"alert",children:e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-exclamation-triangle me-2"}),"Você está offline. Dados não sincronizados podem ser perdidos."]})})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>c(!1),children:"Cancelar"}),e.jsx("button",{type:"button",className:"btn btn-danger",onClick:j,children:"Sair"})]})]})}),e.jsx("div",{className:"modal-backdrop fade show"})]}),e.jsx("style",{jsx:!0,children:`
        .nav-bar {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          color: #adb5bd;
          padding: 8px 16px;
          cursor: pointer;
          transition: color 0.2s;
          flex: 1;
        }
        
        .nav-item i {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }
        
        .nav-item span {
          font-size: 0.8rem;
        }
        
        .nav-item.active {
          color: white;
        }
        
        .nav-item:hover {
          color: white;
        }
      `})]})}export{I as M};
