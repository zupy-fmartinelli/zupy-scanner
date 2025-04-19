import{r as x,j as e,i as v,a as N,u as w,e as y,y as f}from"./main-CIC-T_B5.js";import{Z as k}from"./pwa-scanner-branco-oh03E7i6.js";function S(){const[h,s]=x.useState(!1),[o,r]=x.useState(null);x.useEffect(()=>{const t=()=>{if(v()||window.matchMedia("(display-mode: standalone)").matches){s(!1);return}const n=localStorage.getItem("pwa_prompt_dismissed");if(n){const p=parseInt(n,10),b=Date.now(),d=24*60*60*1e3;if(b-p<d){s(!1);return}}s(!0)},l=n=>{n.preventDefault(),r(n),t()},m=()=>{s(!1),r(null),localStorage.setItem("pwa_installed","true")};return window.addEventListener("beforeinstallprompt",l),window.addEventListener("appinstalled",m),t(),()=>{window.removeEventListener("beforeinstallprompt",l),window.removeEventListener("appinstalled",m)}},[]);const a=async()=>{if(!o){console.log("Prompt de instalação não disponível");return}o.prompt();const{outcome:t}=await o.userChoice;console.log(`Usuário escolheu: ${t}`),r(null),t==="dismissed"&&localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)},c=()=>{localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)};return h?e.jsxs("div",{className:"pwa-install-prompt shadow-lg",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"pwa-install-icon",children:e.jsx("i",{className:"bi bi-download text-primary"})}),e.jsxs("div",{className:"pwa-install-text flex-grow-1",children:[e.jsx("strong",{children:"Instale o Scanner Zupy"}),e.jsx("p",{className:"mb-0 small",children:"Melhor desempenho e acesso offline"})]}),e.jsxs("div",{className:"pwa-install-actions",children:[e.jsx("button",{className:"btn btn-sm btn-primary me-2",onClick:a,children:"Instalar"}),e.jsx("button",{className:"btn btn-sm btn-link text-muted",onClick:c,"aria-label":"Fechar",children:e.jsx("i",{className:"bi bi-x"})})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]}):null}function I({title:h,children:s,activeMenu:o}){const r=N(),{userData:a,scannerData:c,logout:t}=w(),{isOnline:l,syncData:m,isSyncing:n,pendingCount:p}=y(),[b,d]=x.useState(!1),u=i=>{r(i)},g=async()=>{const i=await m();i.synced>0?f.success(`${i.synced} itens sincronizados com sucesso`):i.pending===0&&i.failed===0?f.info("Nenhum item pendente para sincronização"):i.failed>0&&f.error(`${i.failed} itens com falha de sincronização`)},j=async()=>{await t(),r("/auth")};return e.jsxs("div",{className:"d-flex flex-column min-vh-100 bg-light",children:[e.jsx("header",{className:"bg-dark text-white shadow-sm",children:e.jsx("div",{className:"container-fluid",children:e.jsxs("div",{className:"d-flex align-items-center py-2",children:[e.jsx("img",{src:k,alt:"Zupy",className:"me-2",style:{height:"32px"}}),e.jsx("h1",{className:"h5 mb-0 flex-grow-1",children:h}),e.jsxs("div",{className:"d-flex align-items-center me-2",children:[e.jsx("span",{className:`badge ${l?"bg-success":"bg-danger"} me-2`,children:l?"Online":"Offline"}),p>0&&e.jsxs("span",{className:"badge bg-warning me-2",children:[e.jsx("i",{className:"bi bi-clock-history me-1"}),p]})]}),e.jsxs("button",{className:"btn btn-sm btn-outline-light me-2",onClick:g,disabled:n||!l,children:[n?e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}):e.jsx("i",{className:"bi bi-arrow-repeat"}),e.jsx("span",{className:"visually-hidden",children:"Sincronizar"})]}),e.jsxs("div",{className:"dropdown",children:[e.jsxs("button",{className:"btn btn-sm btn-dark dropdown-toggle",type:"button",id:"userMenuButton","data-bs-toggle":"dropdown","aria-expanded":"false",children:[e.jsx("i",{className:"bi bi-person-circle me-1"}),e.jsx("span",{className:"d-none d-md-inline",children:(a==null?void 0:a.name)||"Usuário"})]}),e.jsxs("ul",{className:"dropdown-menu dropdown-menu-end","aria-labelledby":"userMenuButton",children:[e.jsxs("li",{className:"px-3 py-2 text-muted small",children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("strong",{children:"Operador:"})," ",(a==null?void 0:a.name)||"Não identificado"]}),(c==null?void 0:c.name)&&e.jsxs("div",{children:[e.jsx("strong",{children:"Scanner:"})," ",c.name]})]}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider my-1"})}),e.jsx("li",{children:e.jsxs("button",{className:"dropdown-item",onClick:()=>u("/settings"),children:[e.jsx("i",{className:"bi bi-gear me-2"}),"Configurações"]})}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider"})}),e.jsx("li",{children:e.jsxs("button",{className:"dropdown-item text-danger",onClick:()=>d(!0),children:[e.jsx("i",{className:"bi bi-box-arrow-right me-2"}),"Sair"]})})]})]})]})})}),e.jsx("main",{className:"flex-grow-1 bg-dark text-white pb-5",children:s}),e.jsx(S,{}),e.jsxs("footer",{className:"bg-dark text-white border-top shadow-lg fixed-bottom",style:{zIndex:1020},children:[e.jsx("div",{className:"container-fluid",children:e.jsxs("nav",{className:"nav-bar",children:[e.jsxs("button",{className:`nav-item ${o==="history"?"active":""}`,onClick:()=>u("/history"),children:[e.jsx("i",{className:"bi bi-clock-history"}),e.jsx("span",{children:"Histórico"})]}),e.jsx("button",{className:"nav-item-center",onClick:()=>u("/scanner"),children:e.jsx("div",{className:`scan-button-circle ${o==="scanner"?"active":""}`,children:e.jsx("i",{className:"bi bi-qr-code-scan"})})}),e.jsxs("div",{className:"nav-item invisible",children:[e.jsx("i",{className:"bi bi-clock-history"}),e.jsx("span",{children:"Invisível"})]})]})}),e.jsx("style",{jsx:!0,children:`
          .nav-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
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
            font-size: 0.85rem;
          }
          
          .nav-item i {
            font-size: 1.3rem;
            margin-bottom: 4px;
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
            transform: translateY(-20px);
            position: relative;
            z-index: 1030;
            flex: 1;
          }
          
          .scan-button-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--zupy-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
          }
          
          .scan-button-circle i {
            font-size: 1.8rem;
          }
          
          .scan-button-circle.active, 
          .scan-button-circle:hover {
            background-color: var(--zupy-light);
            transform: scale(1.05);
          }
        `})]}),b&&e.jsxs("div",{className:"modal fade show",style:{display:"block"},tabIndex:"-1",children:[e.jsx("div",{className:"modal-dialog modal-dialog-centered",children:e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h5",{className:"modal-title",children:"Confirmação"}),e.jsx("button",{type:"button",className:"btn-close",onClick:()=>d(!1)})]}),e.jsxs("div",{className:"modal-body",children:[e.jsx("p",{children:"Tem certeza que deseja sair do aplicativo?"}),!l&&e.jsx("div",{className:"alert alert-warning",role:"alert",children:e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-exclamation-triangle me-2"}),"Você está offline. Dados não sincronizados podem ser perdidos."]})})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>d(!1),children:"Cancelar"}),e.jsx("button",{type:"button",className:"btn btn-danger",onClick:j,children:"Sair"})]})]})}),e.jsx("div",{className:"modal-backdrop fade show"})]}),e.jsx("style",{jsx:!0,children:`
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
