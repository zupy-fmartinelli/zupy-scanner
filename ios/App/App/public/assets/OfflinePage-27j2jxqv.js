import{a as n,e as t,r as c,j as e}from"./main-N4Ha74AW.js";import{Z as o}from"./pwa-scanner-branco-oh03E7i6.js";function m(){const s=n(),{isOnline:i}=t();c.useEffect(()=>{i&&s("/")},[i,s]);const a=()=>{window.location.reload()};return e.jsxs("div",{className:"d-flex flex-column min-vh-100 bg-dark text-white align-items-center justify-content-center",children:[e.jsxs("div",{className:"container text-center py-5",children:[e.jsx("img",{src:o,alt:"Zupy Scanner",className:"img-fluid mb-4",style:{maxWidth:"180px"}}),e.jsx("h1",{className:"h2 mb-3",children:"Modo Offline"}),e.jsx("div",{className:"d-flex justify-content-center mb-4",children:e.jsx("div",{className:"offline-icon",children:e.jsx("i",{className:"bi bi-wifi-off"})})}),e.jsx("p",{className:"lead mb-4",children:"Você está sem conexão com a internet. Algumas funcionalidades podem estar limitadas."}),e.jsxs("div",{className:"alert alert-light mb-4",role:"alert",children:[e.jsx("i",{className:"bi bi-info-circle me-2"}),"Os scans realizados no modo offline serão sincronizados automaticamente quando a conexão for restabelecida."]}),e.jsxs("div",{className:"d-flex justify-content-center gap-3",children:[e.jsxs("button",{className:"btn btn-outline-light",onClick:a,children:[e.jsx("i",{className:"bi bi-arrow-clockwise me-2"}),"Tentar Novamente"]}),e.jsxs("button",{className:"btn btn-primary",onClick:()=>s("/scanner"),children:[e.jsx("i",{className:"bi bi-qr-code-scan me-2"}),"Continuar Offline"]})]})]}),e.jsx("style",{jsx:!0,children:`
        .offline-icon {
          width: 80px;
          height: 80px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .offline-icon i {
          font-size: 2.5rem;
          color: #e74c3c;
        }
      `})]})}export{m as default};
