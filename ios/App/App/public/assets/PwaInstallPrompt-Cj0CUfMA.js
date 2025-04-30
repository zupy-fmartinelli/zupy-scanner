import{i as d,r as l,j as e}from"./main-BcELyJNJ.js";function h(){if(d())return null;const[p,s]=l.useState(!1),[n,o]=l.useState(null);l.useEffect(()=>{const t=()=>{if(d()||window.matchMedia("(display-mode: standalone)").matches){s(!1);return}const a=localStorage.getItem("pwa_prompt_dismissed");if(a){const x=parseInt(a,10),u=Date.now(),f=24*60*60*1e3;if(u-x<f){s(!1);return}}s(!0)},r=a=>{a.preventDefault(),o(a),t()},i=()=>{s(!1),o(null),localStorage.setItem("pwa_installed","true")};return window.addEventListener("beforeinstallprompt",r),window.addEventListener("appinstalled",i),t(),()=>{window.removeEventListener("beforeinstallprompt",r),window.removeEventListener("appinstalled",i)}},[]);const m=async()=>{if(!n){console.log("Prompt de instalação não disponível");return}n.prompt();const{outcome:t}=await n.userChoice;console.log(`Usuário escolheu: ${t}`),o(null),t==="dismissed"&&localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)},c=()=>{localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)};return p?e.jsxs("div",{className:"pwa-install-prompt shadow-lg",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"pwa-install-icon",children:e.jsx("i",{className:"bi bi-download text-primary"})}),e.jsxs("div",{className:"pwa-install-text flex-grow-1",children:[e.jsx("strong",{children:"Instale o Scanner Zupy"}),e.jsx("p",{className:"mb-0 small",children:"Melhor desempenho e acesso offline"})]}),e.jsxs("div",{className:"pwa-install-actions",children:[e.jsx("button",{className:"btn btn-sm btn-primary me-2",onClick:m,children:"Instalar"}),e.jsx("button",{className:"btn btn-sm btn-link text-muted",onClick:c,"aria-label":"Fechar",children:e.jsx("i",{className:"bi bi-x"})})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]}):null}export{h as P};
