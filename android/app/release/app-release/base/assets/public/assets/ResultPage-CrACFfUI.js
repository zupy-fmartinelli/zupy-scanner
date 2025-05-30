import{r as c,j as e,a as we,d as je,e as ye,u as _e,k as Ne,y as ze}from"./main-N4Ha74AW.js";import{M as Ce,V as Se}from"./CameraVisor-CymAgDiC.js";import"./PwaInstallPrompt-D9QMSuU2.js";import"./pwa-scanner-branco-oh03E7i6.js";function ke({open:p,onClose:a,type:D,onSubmit:y,loading:z=!1,clientDetails:l={},points:m=1,setPoints:Y=()=>{},maxPoints:q=100}){const[F,I]=c.useState(""),[C,v]=c.useState(!1),V=c.useRef(null),x=c.useRef(0),P=c.useRef(0),H=f=>{x.current=f.touches[0].clientY,P.current=x.current,document.addEventListener("touchmove",M,{passive:!1}),document.addEventListener("touchend",S)},M=f=>{f.preventDefault(),P.current=f.touches[0].clientY;const _=P.current-x.current;_<-50&&!C&&v(!0),_>50&&C&&v(!1)},S=()=>{document.removeEventListener("touchmove",M),document.removeEventListener("touchend",S)};if(c.useEffect(()=>()=>{document.removeEventListener("touchmove",M),document.removeEventListener("touchend",S)},[C]),c.useEffect(()=>{p&&v(!0)},[p]),!p)return null;const B=f=>{if(f.preventDefault(),!m||m<1){I("Digite um valor válido");return}I(""),y(f)};return e.jsxs("div",{ref:V,className:`device-action-drawer ${p?"open":""} ${C?"expanded":"collapsed"}`,children:[e.jsx("div",{className:"drawer-handle",onTouchStart:H,style:{cursor:"grab"},children:e.jsx("div",{className:"drawer-handle-icon",children:e.jsx("i",{className:`bi ${C?"bi-chevron-compact-down":"bi-chevron-compact-up"}`})})}),e.jsxs("div",{className:"drawer-content",children:[D==="pontos"&&e.jsxs("form",{onSubmit:B,className:"points-form",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-info",children:[e.jsx("span",{className:"card-number",children:l.card_number?`ZP-${String(l.card_number).slice(-8).toUpperCase()}`:"Cartão"}),l.valid!==!1&&e.jsx("span",{className:"card-valid-badge",children:"Válido"})]}),e.jsx("div",{className:"points-display",children:e.jsxs("span",{className:"current-points",children:[l.points||0," ",l.points_name||"pontos"]})})]}),e.jsxs("div",{className:"points-input-container",children:[e.jsxs("div",{className:"points-input-row",children:[e.jsx("input",{id:"drawerPointsInput",type:"number",min:1,max:q,className:`points-input${F?" input-error":""}`,value:m===0?"":m,onChange:f=>{let _=f.target.value.replace(/^0+(?!$)/,"");_===""&&(_=0),Y(Number(_)),Number(_)>0&&I("")},disabled:z,autoFocus:!0,onFocus:f=>f.target.select(),placeholder:"Pontos"}),e.jsxs("button",{type:"submit",className:"add-points-btn",disabled:z,children:[z?e.jsx("span",{className:"loading-spinner"}):e.jsx("i",{className:"bi bi-plus-circle"}),e.jsx("span",{className:"btn-text",children:"Adicionar"})]})]}),F&&e.jsx("div",{className:"error-message",children:F}),e.jsxs("div",{className:"max-points",children:["Máximo: ",e.jsx("strong",{children:q})," pontos"]})]})]}),D==="resgate"&&e.jsxs("div",{className:"coupon-form",children:[e.jsxs("div",{className:"coupon-header",children:[e.jsxs("h3",{children:["Resgatar Cupom",l.redemption_code?` ${l.redemption_code}`:""]}),l.valid!==!1?e.jsxs("span",{className:"coupon-valid-badge",children:[e.jsx("i",{className:"bi bi-patch-check-fill"}),"Válido"]}):e.jsxs("span",{className:"coupon-invalid-badge",children:[e.jsx("i",{className:"bi bi-x-circle-fill"}),"Inválido"]})]}),l.redemption_date&&e.jsxs("div",{className:"coupon-redemption-date",style:{fontSize:13,color:"#aaa",marginBottom:"4px",textAlign:"center"},children:[e.jsx("i",{className:"bi bi-calendar-check me-1"})," Resgatado em: ",new Date(l.redemption_date).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"})]}),e.jsxs("button",{className:"redeem-btn",onClick:y,disabled:z,style:{marginTop:8,marginBottom:0},children:[z?e.jsx("span",{className:"loading-spinner"}):e.jsx("i",{className:"bi bi-check-circle-fill me-2"}),"Confirmar Resgate"]})]})]}),e.jsx("style",{jsx:!0,children:`
        /* Container do drawer */
        .device-action-drawer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40;
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          background: linear-gradient(180deg, #3d1a68 0%, #2b1047 100%);
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          padding: 12px 20px 180px; /* Padding inferior mínimo para o botão ficar acima do rodapé */
          color: #fff;
          transform: translateY(100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          border-top: 1px solid rgba(255,255,255,0.2);
          border-left: 1px solid rgba(255,255,255,0.1);
          border-right: 1px solid rgba(255,255,255,0.1);
          overflow-y: hidden;
          display: flex;
          flex-direction: column;
          min-height: 180px;
          max-height: 98vh; /* Drawer cobre quase toda a parte inferior, mas deixa o botão sempre visível */
          height: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        /* Estado recolhido do drawer */
        .device-action-drawer.collapsed {
          height: 150px; /* Altura fixa quando recolhido */
          overflow-y: hidden;
        }
        
        /* Estado expandido do drawer */
        .device-action-drawer.expanded {
          height: auto;
          min-height: 240px;
          max-height: 150vh; /* Drawer cobre quase toda a parte inferior */
          overflow-y: auto;
        }
        
        @media (min-width: 480px) {
          .device-action-drawer.expanded {
            max-height: 90vh; /* Em telas maiores, cobre mais da tela e garante botão visível */
          }
        }
        
        @media (min-width: 700px) {
          .device-action-drawer.expanded {
            max-height: 500px; /* Aumenta limite em telas maiores */
          }
        }

        /* Animação para a alça do drawer quando fechado - Ajustar translateY */
        .device-action-drawer:not(.open) {
          /* Manter uma parte maior visível, talvez 40px */
          transform: translateY(calc(100% - 120px));
        }

        /* Ocultar barra de rolagem */
        .device-action-drawer::-webkit-scrollbar {
          display: none;
          width: 0;
        }
        
        /* Estilos de scrollbar removidos para evitar exibição */
        
        .device-action-drawer.open {
          transform: translateY(0);
        }
        
        /* Alça do drawer - melhorada para deslizamento */
        .drawer-handle {
          width: 100%;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 10px;
          cursor: grab;
          position: relative;
          /* Destaque visual para tornar a área de toque mais óbvia */
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          border-radius: 20px 20px 0 0;
          touch-action: none; /* Previne comportamentos padrão de toque */
        }
        
        .drawer-handle:active {
          cursor: grabbing;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        }
        
        .drawer-handle:before {
          content: '';
          width: 60px;
          height: 4px;
          background: rgba(255,255,255,0.6);
          border-radius: 10px;
          display: block;
          margin-top: 2px;
        }
        
        /* Estilos especiais para quando o drawer não está aberto */
        .device-action-drawer:not(.open) .drawer-handle:before {
          background: rgba(255,255,255,0.9);
          height: 5px;
          margin-top: 8px; /* Posiciona a barra branca no centro da área visível */
          box-shadow: 0 0 10px rgba(255,255,255,0.6);
        }
        
        .drawer-handle-icon {
          position: absolute;
          top: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 18px;
          animation: pulse-icon 2s infinite;
        }
        
        /* Estilos especiais para ícone quando o drawer não está aberto */
        .device-action-drawer:not(.open) .drawer-handle-icon {
          top: 0px;
          font-size: 16px;
          color: rgba(255,255,255,0.9);
        }
        
        @keyframes pulse-icon {
          0%, 100% { opacity: 0.7; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(3px); }
        }
        
        /* Botão de fechar */
        .drawer-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          border: none;
          color: #fff;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .drawer-close-btn:hover {
          background: rgba(0,0,0,0.4);
        }
        
        /* Conteúdo do drawer */
        .drawer-content {
          padding: 0 4px 10px; /* Adiciona padding inferior para garantir espaço */
          flex: 1;
          overflow-y: auto;
        }
        
        /* Estilos para o form de pontos */
        .card-header {
          margin-bottom: 24px;
        }
        
        .card-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .card-number {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .card-valid-badge {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.3);
          color: #39FF14;
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
          letter-spacing: 1px;
        }
        
        .points-display {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .points-input-container {
          margin-bottom: 24px;
        }
        
        .points-input-row {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }
        
        .points-input {
          flex: 1;
          height: 60px;
          background: #fff;
          color: #000;
          border: 3px solid #39FF14;
          border-radius: 16px;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          padding: 0 15px;
          letter-spacing: 1px;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .points-input:focus {
          outline: none;
          box-shadow: 0 0 25px rgba(57, 255, 20, 0.5);
        }
        
        .points-input.input-error {
          border-color: #ff2d55;
          box-shadow: 0 0 20px rgba(255, 45, 85, 0.3);
        }
        
        .error-message {
          color: #ff2d55;
          font-weight: 500;
          text-align: center;
          margin-bottom: 8px;
        }
        
        .max-points {
          text-align: right;
          font-size: 13px;
          opacity: 0.8;
        }
        
        .add-points-btn {
          width: auto;
          min-width: 120px;
          height: 60px;
          background: linear-gradient(135deg, #6c3ad1, #a259ff);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(162, 89, 255, 0.4);
        }
        
        .add-points-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #7a47e0, #b16aff);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(162, 89, 255, 0.5);
        }
        
        .add-points-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-text {
          white-space: nowrap;
        }
        
        /* Estilos para o form de cupom */
        .coupon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .coupon-header h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .coupon-valid-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          color: #39FF14;
          font-size: 14px;
          font-weight: 500;
        }
        
        .coupon-invalid-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          color: #ff2d55;
          font-size: 14px;
          font-weight: 500;
        }
        
        .coupon-details {
          background: rgba(0,0,0,0.2);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }
        
        .coupon-title {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .coupon-description {
          opacity: 0.9;
          margin-bottom: 12px;
          font-size: 15px;
        }
        
        .coupon-expiration {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 12px;
        }
        
        .coupon-code {
          display: inline-block;
          background: rgba(0,0,0,0.3);
          padding: 8px 16px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 16px;
          letter-spacing: 1px;
          margin-top: 8px;
        }
        
        .redeem-btn {
          width: 100%;
          height: 58px;
          background: linear-gradient(135deg, #ff9900, #ff5722);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
        }
        
        .redeem-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffab33, #ff7043);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(255, 87, 34, 0.5);
        }
        
        .redeem-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Loading spinner */
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsividade */
        @media (max-width: 480px) {
          .device-action-drawer {
            max-width: 100%;
            padding: 16px 16px 40px;
          }
          
          .points-input {
            height: 60px;
            font-size: 24px;
          }
          
          .add-points-btn, .redeem-btn {
            height: 52px;
            font-size: 16px;
          }
        }
      `})]})}const De="_fadeIn_mylz8_1",i={"device-result-panel":"_device-result-panel_mylz8_4","device-result-header":"_device-result-header_mylz8_12","device-result-icon":"_device-result-icon_mylz8_20","device-result-content":"_device-result-content_mylz8_31","device-accordion":"_device-accordion_mylz8_36","device-accordion-header":"_device-accordion-header_mylz8_44","device-accordion-content":"_device-accordion-content_mylz8_67",fadeIn:De,"device-accordion-section":"_device-accordion-section_mylz8_72","device-accordion-section-title":"_device-accordion-section-title_mylz8_80","device-action-button":"_device-action-button_mylz8_89","device-action-add-points":"_device-action-add-points_mylz8_104","device-action-redeem":"_device-action-redeem_mylz8_116","device-action-new-scan":"_device-action-new-scan_mylz8_128","device-info-card":"_device-info-card_mylz8_141","device-info-row":"_device-info-row_mylz8_148","device-info-label":"_device-info-label_mylz8_159","device-info-value":"_device-info-value_mylz8_164","device-badge":"_device-badge_mylz8_170","device-badge-success":"_device-badge-success_mylz8_180","device-badge-warning":"_device-badge-warning_mylz8_185","device-badge-danger":"_device-badge-danger_mylz8_190","device-badge-info":"_device-badge-info_mylz8_195","device-badge-primary":"_device-badge-primary_mylz8_200","device-badge-secondary":"_device-badge-secondary_mylz8_205","device-reward-card":"_device-reward-card_mylz8_211","device-reward-points":"_device-reward-points_mylz8_219","device-reward-content":"_device-reward-content_mylz8_230","device-reward-title":"_device-reward-title_mylz8_235","device-reward-description":"_device-reward-description_mylz8_241"};function Ee({title:p,message:a,icon:D,colorClass:y}){return e.jsxs("div",{className:`error-message-display d-flex flex-column align-items-center justify-content-center text-center p-4 ${y}`,children:[e.jsx("div",{className:"error-icon mb-3",children:e.jsx("i",{className:`bi ${D}`})}),e.jsx("h4",{className:"error-title mb-2",children:p}),e.jsx("p",{className:"error-message mb-0",children:a}),e.jsx("style",{jsx:!0,children:`
        .error-message-display {
          background: rgba(220, 53, 69, 0.1); /* Fundo levemente vermelho */
          border: 2px solid rgba(220, 53, 69, 0.5); /* Borda vermelha */
          border-radius: 16px;
          padding: 20px;
          margin: 20px auto; /* Centraliza e adiciona margem */
          max-width: 300px; /* Largura máxima */
          color: #dc3545; /* Cor do texto principal */
        }
        
        .error-icon {
          font-size: 4rem; /* Ícone grande */
          color: #dc3545; /* Cor do ícone */
        }
        
        .error-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #dc3545;
        }
        
        .error-message {
          font-size: 1rem;
          color: rgba(220, 53, 69, 0.9); /* Cor do texto da mensagem */
        }
      `})]})}const me=p=>{if(!p)return"-";try{const a=new Date(p),D=a.getDate().toString().padStart(2,"0"),y=(a.getMonth()+1).toString().padStart(2,"0"),z=a.getFullYear();return`${D}/${y}/${z}`}catch{return p}},L={Campeões:{emoji:"🏆",color:"#2E8B57",class:"bg-success-subtle text-success"},"Clientes fiéis":{emoji:"🥇",color:"#2E8B57",class:"bg-success-subtle text-success"},"Lealdade potencial":{emoji:"🎯",color:"#FFD700",class:"bg-warning-subtle text-warning"},"Clientes Recentes":{emoji:"👶",color:"#FFD700",class:"bg-warning-subtle text-warning"},Promissores:{emoji:"🌱",color:"#FFD700",class:"bg-warning-subtle text-warning"},"Precisam de atenção":{emoji:"⚠️",color:"#DC143C",class:"bg-danger-subtle text-danger"},"Prestes a hibernar":{emoji:"😴",color:"#DC143C",class:"bg-danger-subtle text-danger"},"Em risco":{emoji:"🚨",color:"#DC143C",class:"bg-danger-subtle text-danger"},"Não posso perdê-los":{emoji:"📣",color:"#DC143C",class:"bg-danger-subtle text-danger"},Hibernando:{emoji:"🧊",color:"#DC143C",class:"bg-danger-subtle text-danger"},Perdido:{emoji:"🪦",color:"#DC143C",class:"bg-danger-subtle text-danger"},Regular:{emoji:"🔄",color:"#808080",class:"bg-secondary-subtle text-secondary"},default:{emoji:"⭐",color:"#808080",class:"bg-secondary-subtle text-secondary"}};function qe(){var G,J,X,K,ee,se,ae,ie,oe,re,te,ne,ce,de,le,pe;const p=we(),{currentScan:a,clearCurrentScan:D,processScan:y}=je(),{isOnline:z}=ye(),{scannerData:l}=_e(),[m,Y]=c.useState(1),[q,F]=c.useState(!1),[I,C]=c.useState(!1),[v,V]=c.useState(!1),[x,P]=c.useState(!1),[H,M]=c.useState("details"),[S,B]=c.useState("details"),[f,_]=c.useState(""),[Re,xe]=c.useState("success"),[Fe,Q]=c.useState(!1),[W,A]=c.useState(!1),[$,Z]=c.useState(null);if(c.useEffect(()=>{!a||!a.result||a.status==="error"||setTimeout(()=>{var r;a.result.scan_type==="loyalty_card"&&!v?(Z("pontos"),A(!0)):a.result.scan_type==="coupon"&&((r=a.result)==null?void 0:r.can_redeem)===!0&&!x&&(Z("resgate"),A(!0))},200)},[v,a,x]),c.useEffect(()=>{a||p("/scanner")},[a,p]),!a)return null;const s=((G=a.result)==null?void 0:G.details)||{};s.rfm_segment;const E=((J=a.result)==null?void 0:J.scan_type)==="coupon",T=((X=a.result)==null?void 0:X.scan_type)==="loyalty_card",ge=((K=a.result)==null?void 0:K.can_redeem)===!0,ue=async()=>{var r,d;if(!a||!a.result){j("Dados do cupom não disponíveis","error");return}try{C(!0),console.log("Preparando para resgatar cupom...");const g=a.result;if(!l||!l.id){ze.error("Dados do scanner não disponíveis"),console.error("Scanner Data não encontrado:",l);return}if(typeof g.qrData=="string"){console.log("Enviando novo scan com redeem=true para QR:",g.qrData);const n=await y(g.qrData,!0);console.log("Resposta do resgate:",n),n&&n.processed&&n.status!=="error"?(j("Cupom resgatado com sucesso!","success"),P(!0)):console.error("Erro no resgate, resposta:",n)}else{const n=((r=a.result.details)==null?void 0:r.barcode_value)||a.qrData||`zuppy://coupon/${(d=g.details)==null?void 0:d.coupon_id}`;console.log("Realizando novo scan para resgate com redeem=true");const t=await y(n,!0);console.log("Resposta da API de resgate:",t),t&&t.processed&&t.status!=="error"?(j("Cupom resgatado com sucesso!","success"),P(!0)):console.error("Erro na resposta do resgate:",t)}}catch(g){console.error("Erro ao resgatar cupom:",g)}finally{C(!1)}},fe=async r=>{if(r.preventDefault(),!a||!a.result){j("Dados do escaneamento não disponíveis","error");return}if(m<1){j("A quantidade de pontos deve ser maior que zero","error");return}try{F(!0),console.log("Preparando para enviar pontos...");const d=a.result;if(console.log("Dados do scan:",d),!d.scan_id){j("ID do scan não disponível para finalizar a operação","error"),console.error("Scan ID não encontrado:",d);return}if(!l||!l.id){j("Dados do scanner não disponíveis","error"),console.error("Scanner Data não encontrado:",l);return}const g={scan_id:d.scan_id,scanner_id:l.id,points:parseInt(m,10)};console.log("Enviando dados para API:",g),console.log("Enviando para endpoint: /scanner/api/v1/scan/finalize/");const n=await Ne.post("/scanner/api/v1/scan/finalize/",g);console.log("Resposta da API:",n),n&&n.success?(j("Pontos adicionados com sucesso!","success"),V(!0)):(j((n==null?void 0:n.message)||"Erro ao adicionar pontos","error"),console.error("Erro na resposta:",n))}catch(d){console.error("Erro ao enviar pontos:",d),j(d.message||"Erro ao processar a solicitação","error")}finally{F(!1)}},j=(r,d="success")=>{_(r),xe(d),Q(!0),setTimeout(()=>{Q(!1)},3e3)},he=r=>{if(!r)return"-";try{const d=new Date(r),n=new Date-d,t=Math.floor(n/(1e3*60*60*24)),O=Math.floor(n/(1e3*60*60));return t===0?O<1?"agora há pouco":O===1?"há 1 hora":`há ${O} horas`:t===1?"ontem":t<7?`há ${t} dias`:t<14?"há uma semana":t<30?`há ${Math.floor(t/7)} semanas`:t<60?"há um mês":t<365?`há ${Math.floor(t/30)} meses`:`há ${Math.floor(t/365)} anos`}catch{return r}},N=(()=>{var d,g,n;if(!a.processed)return{icon:"bi-hourglass-split",title:"Processando",message:"O QR code está sendo processado e será sincronizado quando online.",colorClass:"text-warning",bgClass:"bg-warning-subtle"};if(a.status==="error"||a.result&&a.result.success===!1){const t=a.errorDetails,O=a.result;let k=t==null?void 0:t.status,o=(t==null?void 0:t.data)||O,h=(o==null?void 0:o.message)||a.error||"Ocorreu um erro desconhecido.",b="Erro",w="bi-exclamation-triangle";const be="text-danger",ve="bg-danger-subtle";let R="generic-error";console.log("Tratando erro/falha:",{status:k,data:o});const u=((d=o==null?void 0:o.message)==null?void 0:d.toLowerCase())||"",U=o==null?void 0:o.error;return U==="INVALID_QR_CODE"?(b="QR Code Inválido",h=(o==null?void 0:o.message)||"Este QR Code não é reconhecido pelo sistema Zupy.",w="bi-question-diamond",R="invalid-qr-code"):k===409||U==="INVALID_COUPON"||u.includes("utilizado")||u.includes("expirado")||u.includes("inválido")||u.includes("outra empresa")?u.includes("used")||u.includes("utilizado")?(b="CUPOM JÁ UTILIZADO!",h="Este cupom já foi utilizado anteriormente e não pode ser resgatado novamente.",w="bi-x-circle-fill",R="coupon-used"):u.includes("expired")||u.includes("expirado")?(b="CUPOM EXPIRADO!",h="Este cupom está expirado e não pode mais ser utilizado.",w="bi-calendar-x",R="coupon-expired"):u.includes("invalid")||u.includes("inválido")||U==="INVALID_COUPON"?(b="CUPOM INVÁLIDO!",h=(o==null?void 0:o.message)||"Este cupom é inválido ou não está disponível para uso.",w="bi-patch-exclamation",R="coupon-invalid"):u.includes("company_mismatch")||u.includes("outra empresa")?(b="EMPRESA INCORRETA",h="Este cartão/cupom pertence a outra empresa e não pode ser processado neste scanner.",w="bi-building-exclamation",R="company-mismatch"):(b=k===409?"Conflito":"Falha",h=(o==null?void 0:o.message)||"Ocorreu um conflito ou falha ao processar a solicitação."):k===400?(b="Requisição Inválida",h=(o==null?void 0:o.message)||"Os dados enviados são inválidos.",w="bi-exclamation-circle"):k===401||k===403?(b="Não Autorizado",h="Você não tem permissão para realizar esta operação. Verifique sua autenticação.",w="bi-lock"):k===404?(b="Não Encontrado",h=(o==null?void 0:o.message)||"O recurso solicitado não foi encontrado.",w="bi-question-circle"):k>=500?(b="Erro do Servidor",h=(o==null?void 0:o.message)||"Ocorreu um erro no servidor. Tente novamente mais tarde.",w="bi-server"):u.includes("pontos insuficientes")&&(b="Pontos Insuficientes",h="O cliente não possui pontos suficientes para esta operação.",w="bi-coin",R="insufficient-points"),{icon:w,title:b,message:h,colorClass:be,bgClass:ve,type:R}}const r=a.result||{};return T?{icon:"bi-trophy",title:v?"Pontos Adicionados":"Cartão de Fidelidade",message:v?`${m} pontos adicionados para ${s.client_name||"o cliente"}.`:`${s.client_name||"Cliente"} - ${s.points||0} pontos atuais`,colorClass:"text-success",bgClass:"bg-success-subtle"}:E?{icon:"bi-ticket-perforated",title:x?"Cupom Resgatado":"Cupom Disponível",message:x?`Cupom "${s.title||((g=r.details)==null?void 0:g.title)||"Promocional"}" resgatado com sucesso!`:`Cupom "${s.title||((n=r.details)==null?void 0:n.title)||"Promocional"}" pronto para uso.`,colorClass:x?"text-success":"text-primary",bgClass:x?"bg-success-subtle":"bg-primary-subtle"}:{icon:"bi-check-circle",title:"Processado com Sucesso",message:r.message||"QR code processado com sucesso.",colorClass:"text-success",bgClass:"bg-success-subtle"}})();return e.jsxs(Ce,{title:"Resultado",activeMenu:"scanner",tabActive:S,onTabChange:B,visor:e.jsxs(Se,{mode:a.status==="error"||a.result&&a.result.success===!1?"error":W&&$==="resgate"?"processing":W&&$==="pontos"?"user_input":v||x?"success":"idle",children:[e.jsx("div",{className:"client-visor-content",children:v&&m>0?e.jsxs("div",{className:"operation-success-screen",children:[e.jsx("div",{className:"success-check-container",children:e.jsx("div",{className:"success-check-icon",children:e.jsx("i",{className:"bi bi-check-lg"})})}),e.jsxs("div",{className:"success-message",children:[e.jsx("div",{className:"success-title",children:"Operação Concluída!"}),e.jsxs("div",{className:"success-points",children:["+",m," pontos"]}),e.jsxs("div",{className:"success-detail",children:["Total atual: ",((se=(ee=a.result)==null?void 0:ee.details)==null?void 0:se.current_points)||s.points||m," pontos"]})," "]})]}):x?e.jsxs("div",{className:"operation-success-screen",children:[e.jsx("div",{className:"success-check-container redemption",children:e.jsx("div",{className:"success-check-icon redemption",children:e.jsx("i",{className:"bi bi-gift"})})}),e.jsxs("div",{className:"success-message",children:[e.jsx("div",{className:"success-title",children:"Prêmio Resgatado!"}),e.jsx("div",{className:"success-detail reward-name",children:s.title||s.reward_name||"Cupom"}),e.jsx("div",{className:"success-points redemption",style:{fontSize:"16px",fontWeight:"600",color:"#ff9900",whiteSpace:"normal",lineHeight:"1.4em"},children:"Resgate efetuado com sucesso"})]})]}):a.status==="error"||a.result&&a.result.success===!1?e.jsx(Ee,{title:N.title,message:N.message,icon:N.icon,colorClass:N.colorClass}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"client-info-header",children:[s.user_photo_url&&e.jsxs("div",{className:"client-photo-area",children:[e.jsx("img",{src:s.user_photo_url,alt:s.client_name,className:"client-photo"}),e.jsx("div",{className:"client-valid-indicator",children:e.jsx("i",{className:"bi bi-check-lg"})})]}),e.jsxs("div",{className:"client-details",children:[e.jsx("div",{className:"client-name-large",children:s.client_name||"-"}),e.jsxs("div",{className:"client-points-large",children:[e.jsx("span",{className:"points-value",children:s.current_points||s.points||0}),e.jsx("span",{className:"points-label",children:"pontos"})]}),!E&&s.rfm_segment&&e.jsxs("div",{className:"client-rfm-info",style:{display:"flex",alignItems:"center",gap:8,marginTop:8,marginBottom:8},children:[e.jsx("span",{className:"rfm-segment-emoji",style:{fontSize:28},children:((ae=L[s.rfm_segment])==null?void 0:ae.emoji)||"🏆"}),e.jsx("span",{className:"rfm-segment-name",style:{fontWeight:700,fontSize:18,color:((ie=L[s.rfm_segment])==null?void 0:ie.color)||"#2E8B57"},children:s.rfm_segment})]})]})]}),E&&ge&&e.jsxs("div",{className:"coupon-visor-highlight",style:{margin:"16px 0 0 0",background:"rgba(255,153,0,0.15)",border:"1.5px solid #ff9900",borderRadius:12,padding:16,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8,width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("i",{className:"bi bi-gift",style:{fontSize:24,color:"#ff9900"}}),e.jsx("span",{style:{fontWeight:700,fontSize:19,color:"#ff9900"},children:"Prêmio para Resgate"})]}),e.jsx("div",{style:{fontWeight:600,fontSize:17,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",width:"100%"},children:s.title||s.reward_name||"Cupom"}),e.jsx("div",{style:{fontSize:15,color:"#fff",opacity:.87,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis",maxHeight:"2.4em",lineHeight:"1.2em"},children:s.description||s.reward_description||""}),e.jsxs("div",{style:{fontSize:14,color:"#ff9900",fontWeight:500},children:[s.points_required?`${s.points_required} pontos`:"",s.expiry_date?` · Válido até ${new Date(s.expiry_date).toLocaleDateString("pt-BR")}`:""]}),(s.code||s.coupon_code||s.barcode_value)&&e.jsx("div",{style:{marginTop:6,fontSize:14,color:"#fff",background:"#ff9900",borderRadius:7,padding:"4px 12px",fontWeight:700,letterSpacing:1},children:String(s.code||s.coupon_code||((oe=String(s.barcode_value).match(/\/([A-Z]{2}-[A-Z0-9]+)/i))==null?void 0:oe[1])||"").toUpperCase()})]}),e.jsxs("div",{className:"client-last-visit-box",style:{marginBottom:18,marginTop:10,display:"flex",alignItems:"center",gap:8},children:[e.jsx("i",{className:"bi bi-calendar-check"}),e.jsx("span",{style:{fontWeight:500,fontSize:15},children:"Última visita:"}),e.jsx("b",{style:{fontSize:15},children:s.last_visit?new Date(s.last_visit).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}),e.jsxs("span",{style:{fontSize:13,color:"#aaa",marginLeft:8},children:["(",he(s.last_visit),")"]})]}),e.jsxs("div",{className:"client-additional-info",children:[!E&&s.next_reward_gap&&s.next_reward_gap.name&&e.jsxs("div",{className:"progress-bar-container",children:[e.jsxs("div",{className:"progress-label",children:["Próximo prêmio: ",e.jsx("b",{children:s.next_reward_gap.name})]}),e.jsx("div",{className:"progress-bar-wrapper",children:e.jsx("div",{className:"progress-bar",style:{width:`${Math.min(100,100-s.next_reward_gap.missing_points/s.next_reward_gap.points_required*100)}%`}})}),e.jsxs("div",{className:"progress-values",children:[e.jsxs("span",{children:["Faltam ",s.next_reward_gap.missing_points," pts"]}),e.jsxs("span",{children:[s.next_reward_gap.points_required," pts"]})]})]}),Array.isArray(s.available_rewards)&&s.available_rewards.length>0&&!s.next_reward_gap&&e.jsxs("div",{className:"client-notification reward-notification",children:[e.jsx("div",{className:"notification-icon",children:e.jsx("i",{className:"bi bi-gift-fill"})}),e.jsxs("div",{className:"notification-content",children:[e.jsx("div",{className:"notification-title",children:"Prêmios Disponíveis!"}),e.jsxs("div",{className:"notification-text",children:["Cliente tem ",s.available_rewards.length," prêmio(s) para resgate"]})]})]})]})]})}),e.jsx("style",{jsx:!0,children:`
            .client-visor-content {
              display: flex;
              flex-direction: column;
              height: auto;
              padding: 24px 14px 24px 14px; /* padding ajustado para evitar scroll desnecessário */
              color: white;
              overflow-y: visible;
              scrollbar-width: none;
              position: relative;
              box-sizing: border-box;
              min-height: 300px;
              max-height: 100vh;
            }

            .client-visor-content::-webkit-scrollbar {
              display: none;
            }

            /* Área de status/mensagens no topo para feedback */
            /* Nova tela de sucesso de operação */
            .operation-success-screen {
              /* position: absolute; */ /* Mantido comentado */
              /* top: 0; */
              /* left: 0; */
              width: 100%;
              height: 100%; /* Ocupa o espaço do visor */
              /* background: rgba(0, 0, 0, 0.85); */ /* REMOVIDO fundo escuro */
              z-index: 100;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              animation: fade-in 0.3s ease-out;
              border-radius: inherit; /* Herda o border-radius do pai */
            }

            .success-check-container {
              margin-bottom: 24px;
              width: 110px;
              height: 110px;
              border-radius: 50%;
              background: rgba(57, 255, 20, 0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
              animation: pulse-success 2s infinite ease-in-out;
            }

            .success-check-container.redemption {
              background: rgba(255, 153, 0, 0.15);
              box-shadow: 0 0 30px rgba(255, 153, 0, 0.5);
            }

            .success-check-icon {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              background: #39FF14;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            }

            .success-check-icon.redemption {
              background: #ff9900;
            }

            .success-check-icon i {
              font-size: 54px;
              color: rgba(0, 0, 0, 0.8);
              text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
            }

            .success-message {
              text-align: center;
              max-width: 280px;
            }

            .success-title {
              font-size: 24px;
              font-weight: 700;
              color: white;
              margin-bottom: 8px;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
            }

            .success-points {
              font-size: 36px;
              font-weight: 800;
              color: #39FF14;
              margin-bottom: 8px;
              text-shadow: 0 0 12px rgba(57, 255, 20, 0.7);
              letter-spacing: 0.5px;
            }

            .success-points.redemption {
              /* Estilos movidos inline para ajuste específico */
              /* font-size: 18px; */
              /* font-weight: 600; */
              /* color: #ff9900; */
            }

            .success-detail {
              font-size: 16px;
              color: #ffffff;
              font-weight: 500;
              opacity: 0.8;
            }

            .success-detail.reward-name {
              font-size: 24px;
              font-weight: 700;
              color: #ff9900;
              margin-bottom: 10px;
              text-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
            }

            @keyframes pulse-success {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.05);
                opacity: 0.9;
              }
            }

            .status-message {
              padding: 8px 12px;
              border-radius: 10px;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 500;
              animation: fade-in 0.3s ease-in-out;
            }

            .status-message.success {
              background: rgba(40, 167, 69, 0.2);
              border: 1px solid rgba(40, 167, 69, 0.4);
              color: #39FF14;
            }

            .status-message.error {
              background: rgba(220, 53, 69, 0.2);
              border: 1px solid rgba(220, 53, 69, 0.4);
              color: #ff6b6b;
            }

            .status-message i {
              font-size: 16px;
            }

            /* Área de informações principais - reorganizada */
            .client-info-header {
              display: flex;
              align-items: center;
              padding: 10px;
              margin-bottom: 14px;
              background: rgba(0,0,0,0.15);
              border-radius: 12px;
            }

            .client-photo-area {
              position: relative;
              margin-right: 14px;
            }

            .client-photo {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid rgba(255,255,255,0.2);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .client-photo-placeholder {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: linear-gradient(135deg, #2d3142, #1e2334);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #adb5bd;
              border: 3px solid rgba(255,255,255,0.1);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .client-valid-indicator {
              position: absolute;
              bottom: 0;
              right: 0;
width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #39FF14;
              color: rgba(0,0,0,0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              border: 2px solid rgba(0,0,0,0.2);
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }

            .client-details {
              flex: 1;
            }

            .client-name-large {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 8px;
              color: white;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
              line-height: 1.1;
            }

            .client-points-large {
              display: flex;
              align-items: baseline;
              margin-bottom: 8px;
            }

            .points-value {
              font-size: 28px;
              font-weight: 700;
              color: #39FF14;
              text-shadow: 0 2px 6px rgba(0,0,0,0.4);
            }

            .points-label {
              font-size: 16px;
              font-weight: 500;
              color: rgba(255,255,255,0.8);
              margin-left: 6px;
            }

            .client-card-info {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .card-number {
              font-size: 14px;
              color: rgba(255,255,255,0.7);
            }

            .card-number span {
              font-weight: 600;
              letter-spacing: 0.5px;
            }

            /* Informações adicionais - melhor organizadas */
            .client-additional-info {
              display: flex;
              flex-direction: column;
              gap: 14px;
            }

            /* Segmento RFM com design aprimorado */
            .client-segment-box {
              padding: 10px;
              background: rgba(0,0,0,0.15);
              border-radius: 10px;
              margin-bottom: 4px;
            }

            .segment-label {
              font-size: 13px;
              color: rgba(255,255,255,0.6);
              margin-bottom: 6px;
            }

            .segment-badge-large {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 10px;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 600;
            }

            .segment-emoji {
              font-size: 18px;
              margin-right: 4px;
            }

            /* Visita e progresso */
            .client-visit-info {
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding: 10px;
              background: rgba(0,0,0,0.15);
              border-radius: 10px;
            }

            .visit-date {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: rgba(255,255,255,0.75);
            }

            .progress-bar-container {
              margin-top: 2px;
            }

            .progress-label {
              font-size: 13px;
              margin-bottom: 6px;
              color: rgba(255,255,255,0.75);
            }

            .progress-bar-wrapper {
              height: 8px;
              background: rgba(255,255,255,0.1);
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 4px;
            }

            .progress-bar {
              height: 100%;
              background: linear-gradient(90deg, #00a3ff, #39FF14);
              border-radius: 4px;
              transition: width 0.6s ease;
            }

            .progress-values {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: rgba(255,255,255,0.6);
            }

            /* Notificações */
            .client-notification {
              display: flex;
              align-items: center;
              padding: 12px;
              border-radius: 10px;
              margin-top: 4px;
            }

            .reward-notification {
              background: rgba(40, 167, 69, 0.15);
              border: 1px solid rgba(40, 167, 69, 0.3);
            }

            .notification-icon {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: rgba(40, 167, 69, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              color: #39FF14;
              margin-right: 12px;
            }

            .notification-content {
              flex: 1;
            }

            .notification-title {
              font-size: 15px;
              font-weight: 600;
              color: #39FF14;
              margin-bottom: 2px;
            }

            .notification-text {
              font-size: 13px;
              color: rgba(255,255,255,0.8);
            }

            /* Animações */
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slide-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @media (max-width: 380px) {
              .client-photo, .client-photo-placeholder {
                width: 70px;
                height: 70px;
              }

              .client-name-large {
                font-size: 20px;
              }

              .points-value {
                font-size: 24px;
              }
            }
          `})]}),children:[a.status==="error"||a.result&&a.result.success===!1?e.jsx("div",{className:"px-2",children:" "}):e.jsxs("div",{className:"px-2",children:[e.jsx("div",{className:i["device-result-panel"],children:e.jsxs("div",{className:i["device-result-header"],children:[e.jsx("div",{className:i["device-result-icon"],style:{color:N.colorClass.replace("text-","")},children:e.jsx("i",{className:`bi ${N.icon}`})}),e.jsxs("div",{children:[e.jsx("h4",{style:{margin:"0 0 4px 0",fontSize:"18px",color:N.colorClass.replace("text-","")},children:N.title}),e.jsx("p",{style:{margin:0,fontSize:"14px",opacity:.9},children:N.message})]})]})})," ",S==="details"&&e.jsx("div",{className:"tab-content p-2",children:e.jsxs("div",{className:i["device-info-card"],children:[e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Data/Hora"}),e.jsx("div",{className:i["device-info-value"],children:new Date(a.timestamp).toLocaleString()})]}),((re=a.result)==null?void 0:re.scan_id)&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"ID do Scan"}),e.jsx("div",{className:i["device-info-value"],style:{fontSize:"13px",opacity:.8},children:a.result.scan_id})]}),((te=a.result)==null?void 0:te.scan_type)&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Tipo"}),e.jsx("div",{className:i["device-info-value"],children:T?"Cartão de Fidelidade":E?"Cupom":a.result.scan_type})]}),((ce=(ne=a.result)==null?void 0:ne.details)==null?void 0:ce.program_name)&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Programa"}),e.jsx("div",{className:i["device-info-value"],children:a.result.details.program_name})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Status"}),e.jsx("div",{className:i["device-info-value"],children:e.jsx("span",{className:`${i["device-badge"]} ${i["device-badge-"+(a.processed?"success":"warning")]}`,children:a.processed?"Processado":"Pendente"})})]}),T&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Pontos"}),e.jsxs("div",{className:i["device-info-value"],children:[e.jsx("span",{className:"fw-bold",style:{color:"#39FF14"},children:s.points||0}),v&&e.jsxs("span",{className:"ms-2 badge bg-success",children:["+",m]})]})]}),E&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Status do Cupom"}),e.jsx("div",{className:i["device-info-value"],children:x?e.jsx("span",{className:"badge bg-success",children:"Resgatado"}):e.jsx("span",{className:"badge bg-primary",children:"Disponível"})})]})]})}),S==="client"&&(T||E)&&e.jsx("div",{className:"tab-content p-2 mt-3",children:e.jsxs("div",{className:i["device-info-card"],children:[e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Nome"}),e.jsx("div",{className:i["device-info-value"],children:s.client_name||"-"})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Cartão"}),e.jsxs("div",{className:i["device-info-value"],children:[s.card_number," // O backend deve fornecer o card_number já formatado"]})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Segmento"}),e.jsx("div",{className:i["device-info-value"],children:e.jsxs("span",{className:`badge ${(le=(de=L[s.rfm_segment])==null?void 0:de.class)==null?void 0:le.replace("text-","text-bg-")}`,children:[(pe=L[s.rfm_segment])==null?void 0:pe.emoji," ",s.rfm_segment]})})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Email"}),e.jsx("div",{className:i["device-info-value"],children:s.email||"-"})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Telefone"}),e.jsx("div",{className:i["device-info-value"],children:s.phone||"-"})]}),e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Última Visita"}),e.jsx("div",{className:i["device-info-value"],children:me(s.last_visit)})]}),s.signup_date&&e.jsxs("div",{className:i["device-info-row"],children:[e.jsx("div",{className:i["device-info-label"],children:"Cliente desde"}),e.jsx("div",{className:i["device-info-value"],children:me(s.signup_date)})]})]})}),S==="rewards"&&e.jsxs("div",{className:"tab-content p-2 mt-3",children:[s.next_reward_gap&&s.next_reward_gap.name&&e.jsxs("div",{className:i["device-info-card"],style:{marginBottom:"16px"},children:[e.jsx("h5",{className:"mb-3",children:"Próximo Prêmio"}),e.jsxs("div",{className:"d-flex align-items-center mb-2",children:[e.jsxs("div",{className:"flex-grow-1",children:[e.jsx("div",{className:"fw-bold",children:s.next_reward_gap.name}),e.jsxs("div",{className:"text-muted small",children:["Faltam ",s.next_reward_gap.missing_points," de ",s.next_reward_gap.points_required," pontos"]})]}),e.jsx("div",{className:"ms-3",children:e.jsxs("span",{className:"badge bg-primary",children:[Math.floor((1-s.next_reward_gap.missing_points/s.next_reward_gap.points_required)*100),"%"]})})]}),e.jsx("div",{className:"progress",style:{height:"8px"},children:e.jsx("div",{className:"progress-bar",role:"progressbar",style:{width:`${Math.min(100,100-s.next_reward_gap.missing_points/s.next_reward_gap.points_required*100)}%`,background:"linear-gradient(90deg, #00a3ff, #39FF14)"}})})]}),Array.isArray(s.available_rewards)&&s.available_rewards.length>0?e.jsxs("div",{className:i["device-info-card"],children:[e.jsx("h5",{className:"mb-3",children:"Prêmios Disponíveis"}),s.available_rewards.map((r,d)=>e.jsx("div",{className:"card mb-2",style:{background:"rgba(57, 255, 20, 0.1)",border:"1px solid rgba(57, 255, 20, 0.3)"},children:e.jsx("div",{className:"card-body p-3",children:e.jsxs("div",{className:"d-flex",children:[e.jsx("div",{className:"reward-icon me-3",children:e.jsx("i",{className:"bi bi-gift-fill fs-3",style:{color:"#39FF14"}})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1",children:r.name}),e.jsx("p",{className:"mb-0 small",children:r.description||"Sem descrição disponível"}),r.expiry_date&&e.jsxs("small",{className:"text-muted",children:["Válido até ",new Date(r.expiry_date).toLocaleDateString()]})]})]})})},d))]}):e.jsx("div",{className:"alert alert-info",role:"alert",children:"Não há prêmios disponíveis para resgate no momento."})]})]}),e.jsx(ke,{open:W,onClose:()=>A(!1),type:$,onSubmit:$==="pontos"?r=>{fe(r),A(!1)}:r=>{ue(),A(!1)},loading:$==="pontos"?q:I,clientDetails:s,points:m,setPoints:Y,maxPoints:s.operator_max_points||100})]})}export{qe as default};
