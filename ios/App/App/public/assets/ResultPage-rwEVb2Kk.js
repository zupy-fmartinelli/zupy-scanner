import{r as d,j as e,a as te,d as ce,e as de,u as le,k as W,y as pe}from"./main-8IGYUPaQ.js";import{M as me}from"./MainLayout-BTQmRPiH.js";import{V as ue}from"./CameraVisor-7z3sIFha.js";import"./pwa-scanner-branco-oh03E7i6.js";function xe({open:m,onClose:r,type:A,onSubmit:D,loading:w=!1,clientDetails:t={},points:b=1,setPoints:q=()=>{},maxPoints:P=100}){const[_,z]=d.useState(""),[f,h]=d.useState(!1),$=d.useRef(null),g=d.useRef(0),y=d.useRef(0),Y=l=>{g.current=l.touches[0].clientY,y.current=g.current,document.addEventListener("touchmove",R,{passive:!1}),document.addEventListener("touchend",v)},R=l=>{l.preventDefault(),y.current=l.touches[0].clientY;const x=y.current-g.current;x<-50&&!f&&h(!0),x>50&&f&&h(!1)},v=()=>{document.removeEventListener("touchmove",R),document.removeEventListener("touchend",v)};if(d.useEffect(()=>()=>{document.removeEventListener("touchmove",R),document.removeEventListener("touchend",v)},[f]),!m)return null;const M=l=>{if(l.preventDefault(),!b||b<1){z("Digite um valor válido");return}z(""),D(l)};return e.jsxs("div",{ref:$,className:`device-action-drawer ${m?"open":""} ${f?"expanded":"collapsed"}`,children:[e.jsx("div",{className:"drawer-handle",onClick:()=>h(!f),onTouchStart:Y,children:e.jsx("div",{className:"drawer-handle-icon",children:e.jsx("i",{className:`bi ${f?"bi-chevron-compact-down":"bi-chevron-compact-up"}`})})}),e.jsxs("div",{className:"drawer-content",children:[A==="pontos"&&e.jsxs("form",{onSubmit:M,className:"points-form",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-info",children:[e.jsx("span",{className:"card-number",children:t.card_number?`ZP-${String(t.card_number).slice(-8).toUpperCase()}`:"Cartão"}),t.valid!==!1&&e.jsx("span",{className:"card-valid-badge",children:"Válido"})]}),e.jsx("div",{className:"points-display",children:e.jsxs("span",{className:"current-points",children:[t.points||0," ",t.points_name||"pontos"]})})]}),e.jsxs("div",{className:"points-input-container",children:[e.jsxs("div",{className:"points-input-row",children:[e.jsx("input",{id:"drawerPointsInput",type:"number",min:1,max:P,className:`points-input${_?" input-error":""}`,value:b===0?"":b,onChange:l=>{let x=l.target.value.replace(/^0+(?!$)/,"");x===""&&(x=0),q(Number(x)),Number(x)>0&&z("")},disabled:w,autoFocus:!0,onFocus:l=>l.target.select(),placeholder:"Pontos"}),e.jsxs("button",{type:"submit",className:"add-points-btn",disabled:w,children:[w?e.jsx("span",{className:"loading-spinner"}):e.jsx("i",{className:"bi bi-plus-circle"}),e.jsx("span",{className:"btn-text",children:"Adicionar"})]})]}),_&&e.jsx("div",{className:"error-message",children:_}),e.jsxs("div",{className:"max-points",children:["Máximo: ",e.jsx("strong",{children:P})," pontos"]})]})]}),A==="resgate"&&e.jsxs("div",{className:"coupon-form",children:[e.jsxs("div",{className:"coupon-header",children:[e.jsx("h3",{children:"Resgatar Cupom"}),t.valid!==!1?e.jsxs("span",{className:"coupon-valid-badge",children:[e.jsx("i",{className:"bi bi-patch-check-fill"}),"Válido"]}):e.jsxs("span",{className:"coupon-invalid-badge",children:[e.jsx("i",{className:"bi bi-x-circle-fill"}),"Inválido"]})]}),e.jsxs("div",{className:"coupon-details",children:[e.jsx("h4",{className:"coupon-title",children:t.title||"Cupom"}),e.jsx("p",{className:"coupon-description",children:t.description||"Descrição não disponível"}),t.expiration&&e.jsxs("div",{className:"coupon-expiration",children:["Válido até ",new Date(t.expiration).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"})]}),(()=>{let l=t.code||t.coupon_code;if(!l&&t.barcode_value){const x=String(t.barcode_value).match(/\/([A-Z]{2}-[A-Z0-9]+)/i);x&&(l=x[1])}return l?e.jsx("div",{className:"coupon-code",children:String(l).toUpperCase()}):null})()]}),e.jsxs("button",{className:"redeem-btn",onClick:D,disabled:w,children:[w?e.jsx("span",{className:"loading-spinner"}):e.jsx("i",{className:"bi bi-check-circle-fill me-2"}),"Confirmar Resgate"]})]})]}),e.jsx("style",{jsx:!0,children:`
        /* Container do drawer */
        .device-action-drawer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40; /* Menor que o rodapé (z-index: 50) e maior que o visor (z-index: 20) */
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          background: linear-gradient(180deg, #3d1a68 0%, #2b1047 100%);
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          padding: 12px 20px 80px; /* Padding reduzido no topo e mantido no fundo para o rodapé */
          color: #fff;
          transform: translateY(100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          border-top: 1px solid rgba(255,255,255,0.2);
          border-left: 1px solid rgba(255,255,255,0.1);
          border-right: 1px solid rgba(255,255,255,0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          height: 180px; /* Altura reduzida ainda mais para modo recolhido */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        
        /* Estado recolhido do drawer */
        .device-action-drawer.collapsed {
          height: 180px; /* Altura reduzida para modo recolhido */
        }
        
        /* Estado expandido do drawer */
        .device-action-drawer.expanded {
          height: calc(100vh - 280px); /* Altura ajustada para não ultrapassar a barra central */
        }
        
        /* Animação para a alça do drawer quando fechado */
        .device-action-drawer:not(.open) {
          transform: translateY(calc(100% - 20px)); /* Mostra apenas a alça e a barra quando fechado */
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
          padding: 0 4px;
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
      `})]})}const ge="_fadeIn_mylz8_1",a={"device-result-panel":"_device-result-panel_mylz8_4","device-result-header":"_device-result-header_mylz8_12","device-result-icon":"_device-result-icon_mylz8_20","device-result-content":"_device-result-content_mylz8_31","device-accordion":"_device-accordion_mylz8_36","device-accordion-header":"_device-accordion-header_mylz8_44","device-accordion-content":"_device-accordion-content_mylz8_67",fadeIn:ge,"device-accordion-section":"_device-accordion-section_mylz8_72","device-accordion-section-title":"_device-accordion-section-title_mylz8_80","device-action-button":"_device-action-button_mylz8_89","device-action-add-points":"_device-action-add-points_mylz8_104","device-action-redeem":"_device-action-redeem_mylz8_116","device-action-new-scan":"_device-action-new-scan_mylz8_128","device-info-card":"_device-info-card_mylz8_141","device-info-row":"_device-info-row_mylz8_148","device-info-label":"_device-info-label_mylz8_159","device-info-value":"_device-info-value_mylz8_164","device-badge":"_device-badge_mylz8_170","device-badge-success":"_device-badge-success_mylz8_180","device-badge-warning":"_device-badge-warning_mylz8_185","device-badge-danger":"_device-badge-danger_mylz8_190","device-badge-info":"_device-badge-info_mylz8_195","device-badge-primary":"_device-badge-primary_mylz8_200","device-badge-secondary":"_device-badge-secondary_mylz8_205","device-reward-card":"_device-reward-card_mylz8_211","device-reward-points":"_device-reward-points_mylz8_219","device-reward-content":"_device-reward-content_mylz8_230","device-reward-title":"_device-reward-title_mylz8_235","device-reward-description":"_device-reward-description_mylz8_241"},p={Campeões:{emoji:"🏆",color:"#2E8B57",class:"bg-success-subtle text-success"},"Clientes fiéis":{emoji:"🥇",color:"#2E8B57",class:"bg-success-subtle text-success"},"Lealdade potencial":{emoji:"🎯",color:"#FFD700",class:"bg-warning-subtle text-warning"},"Clientes Recentes":{emoji:"👶",color:"#FFD700",class:"bg-warning-subtle text-warning"},"Precisam de atenção":{emoji:"⚠️",color:"#DC143C",class:"bg-danger-subtle text-danger"},"Em risco":{emoji:"🚨",color:"#DC143C",class:"bg-danger-subtle text-danger"},Perdido:{emoji:"🪦",color:"#DC143C",class:"bg-danger-subtle text-danger"},Regular:{emoji:"🔄",color:"#808080",class:"bg-secondary-subtle text-secondary"},default:{emoji:"⭐",color:"#808080",class:"bg-secondary-subtle text-secondary"}},ee=m=>m?typeof m=="string"&&m.length>=20?m.toUpperCase():typeof m=="number"||/^\d+$/.test(m)?`ZP-${m}`:(typeof m=="string"?m:String(m)).toUpperCase():"-";function we(){var V,Z,B,Q,H,J,X,G,K;const m=te(),{currentScan:r,clearCurrentScan:A,processScan:D}=ce(),{isOnline:w}=de(),{scannerData:t}=le(),[b,q]=d.useState(1),[P,_]=d.useState(!1),[z,f]=d.useState(!1),[h,$]=d.useState(!1),[g,y]=d.useState(!1),[Y,R]=d.useState("details"),[v,M]=d.useState("details"),[l,x]=d.useState(""),[T,se]=d.useState("success"),[ae,O]=d.useState(!1),[I,C]=d.useState(!1),[S,U]=d.useState(null);d.useEffect(()=>{!r||!r.result||setTimeout(()=>{var s;r.result.scan_type==="loyalty_card"&&!h?(U("pontos"),C(!0)):r.result.scan_type==="coupon"&&((s=r.result)==null?void 0:s.can_redeem)===!0&&!g&&(U("resgate"),C(!0))},200)},[h,r,g]);const ie=d.useCallback(s=>{if(!s)return p.default;const o=s.recency||0,c=s.frequency||0,n=s.monetary||0;return o>=4&&c>=4&&n>=4?p.Campeões||p.default:o>=4&&c>=3&&n>=3?p["Clientes fiéis"]||p.default:o>=3&&c>=2&&n>=2?p["Lealdade potencial"]||p.default:o>=4&&c<=2&&n<=2?p["Clientes Recentes"]||p.default:o<=2&&c>=3&&n>=3?p["Precisam de atenção"]||p.default:o<=2&&c<=2&&n>=3?p["Em risco"]||p.default:o<=1&&c<=1&&n<=1?p.Perdido||p.default:p.Regular||p.default},[]);if(d.useEffect(()=>{r||m("/scanner")},[r,m]),!r)return null;const i=((V=r.result)==null?void 0:V.details)||{},re=i.rfm||{},N=ie(re),F=((Z=r.result)==null?void 0:Z.scan_type)==="coupon",E=((B=r.result)==null?void 0:B.scan_type)==="loyalty_card";(Q=r.result)==null||Q.can_redeem;const oe=async()=>{var s,o;if(!r||!r.result){u("Dados do cupom não disponíveis","error");return}try{f(!0),console.log("Preparando para resgatar cupom...");const c=r.result;if(!t||!t.id){pe.error("Dados do scanner não disponíveis"),console.error("Scanner Data não encontrado:",t);return}if(typeof c.qrData=="string"){console.log("Enviando novo scan com redeem=true para QR:",c.qrData);const n=await D(c.qrData,!0);console.log("Resposta do resgate:",n),n&&n.processed?(u("Cupom resgatado com sucesso!","success"),y(!0),r.result=n.result,r.processed=!0):(u("Erro ao resgatar cupom. Tente novamente.","error"),console.error("Erro no resgate, resposta:",n))}else{const n=((s=r.result.details)==null?void 0:s.barcode_value)||r.qrData||`zuppy://coupon/${(o=c.details)==null?void 0:o.coupon_id}`;console.log("Realizando novo scan para resgate com redeem=true");const j=await W.post("/scanner/api/v1/scan/",{qr_code:n,scanner_id:t.id,redeem:!0});console.log("Resposta da API de resgate:",j),j&&j.success?(u("Cupom resgatado com sucesso!","success"),y(!0),r.result=j,r.processed=!0):(u((j==null?void 0:j.message)||"Erro ao resgatar cupom","error"),console.error("Erro na resposta do resgate:",j))}}catch(c){console.error("Erro ao resgatar cupom:",c),u(c.message||"Erro ao processar o resgate","error")}finally{f(!1)}},ne=async s=>{if(s.preventDefault(),!r||!r.result){u("Dados do escaneamento não disponíveis","error");return}if(b<1){u("A quantidade de pontos deve ser maior que zero","error");return}try{_(!0),console.log("Preparando para enviar pontos...");const o=r.result;if(console.log("Dados do scan:",o),!o.scan_id){u("ID do scan não disponível para finalizar a operação","error"),console.error("Scan ID não encontrado:",o);return}if(!t||!t.id){u("Dados do scanner não disponíveis","error"),console.error("Scanner Data não encontrado:",t);return}const c={scan_id:o.scan_id,scanner_id:t.id,points:parseInt(b,10)};console.log("Enviando dados para API:",c),console.log("Enviando para endpoint: /scanner/api/v1/scan/finalize/");const n=await W.post("/scanner/api/v1/scan/finalize/",c);console.log("Resposta da API:",n),n&&n.success?(u("Pontos adicionados com sucesso!","success"),$(!0),r.result=n,r.processed=!0):(u((n==null?void 0:n.message)||"Erro ao adicionar pontos","error"),console.error("Erro na resposta:",n))}catch(o){console.error("Erro ao enviar pontos:",o),u(o.message||"Erro ao processar a solicitação","error")}finally{_(!1)}},u=(s,o="success")=>{x(s),se(o),O(!0),setTimeout(()=>{O(!1)},3e3)},L=s=>{if(!s)return"-";try{return new Date(s).toLocaleString()}catch{return s}},k=(()=>{var o,c;if(!r.processed)return{icon:"bi-hourglass-split",title:"Processando",message:"O QR code está sendo processado e será sincronizado quando online.",colorClass:"text-warning",bgClass:"bg-warning-subtle"};if(r.status==="error")return{icon:"bi-exclamation-triangle",title:"Erro no Processamento",message:r.error||"Ocorreu um erro ao processar o QR code.",colorClass:"text-danger",bgClass:"bg-danger-subtle"};const s=r.result||{};return s.error==="COMPANY_MISMATCH"||s.message&&s.message.includes("outra empresa")?{icon:"bi-building-exclamation",title:"EMPRESA INCORRETA",message:"Este cartão pertence a outra empresa e não pode ser processado neste scanner.",colorClass:"text-danger",bgClass:"bg-danger-subtle",type:"company-mismatch"}:s.message&&(s.message.includes("USED")||s.message.includes("EXPIRED")||s.message.includes("INVALID")||s.message.includes("usado")||s.message.includes("expirado")||s.message.includes("inválido")||s.error==="INVALID_COUPON"||s.success===!1)?{icon:"bi-x-circle-fill",title:"CUPOM JÁ UTILIZADO!",message:s.message.includes("USED")||s.message.includes("usado")?"Este cupom já foi utilizado e não pode ser resgatado novamente.":s.message.includes("EXPIRED")||s.message.includes("expirado")?"Este cupom está expirado e não pode mais ser utilizado.":"Este cupom é inválido ou não está disponível para uso.",colorClass:"text-danger",bgClass:"bg-danger-subtle",type:"coupon-used"}:E?{icon:"bi-trophy",title:h?"Pontos Adicionados":"Cartão de Fidelidade",message:h?`${b} pontos adicionados para ${i.client_name||"o cliente"}.`:`${i.client_name||"Cliente"} - ${i.points||0} pontos atuais`,colorClass:"text-success",bgClass:"bg-success-subtle"}:F?s.status==="used"||s.status==="USED"||s.success===!1||s.details&&(s.details.status==="used"||s.details.status==="USED")?{icon:"bi-x-circle-fill",title:"CUPOM JÁ UTILIZADO!",message:"Este cupom já foi utilizado anteriormente e não pode ser resgatado novamente.",colorClass:"text-danger",bgClass:"bg-danger-subtle",type:"coupon-used"}:{icon:"bi-ticket-perforated",title:g?"Cupom Resgatado":"Cupom Disponível",message:g?`Cupom "${i.title||((o=s.details)==null?void 0:o.title)||"Promocional"}" resgatado com sucesso!`:`Cupom "${i.title||((c=s.details)==null?void 0:c.title)||"Promocional"}" pronto para uso.`,colorClass:g?"text-success":"text-primary",bgClass:g?"bg-success-subtle":"bg-primary-subtle"}:{icon:"bi-check-circle",title:"Processado com Sucesso",message:s.message||"QR code processado com sucesso.",colorClass:"text-success",bgClass:"bg-success-subtle"}})();return e.jsxs(me,{title:"Resultado",activeMenu:"scanner",tabActive:v,onTabChange:M,visor:e.jsxs(ue,{mode:I&&S==="pontos"?"user_input":I&&S==="resgate"?"success":"idle",children:[e.jsxs("div",{className:"client-visor-content",children:[e.jsx("div",{className:"client-status-header",children:ae?e.jsxs("div",{className:`status-message ${T}`,children:[e.jsx("i",{className:`bi ${T==="success"?"bi-check-circle-fill":T==="error"?"bi-exclamation-circle-fill":"bi-info-circle-fill"}`}),e.jsx("span",{children:l})]}):e.jsxs("div",{className:"status-message success",children:[e.jsx("i",{className:"bi bi-check-circle-fill"}),e.jsx("span",{children:"Cliente identificado"})]})}),e.jsxs("div",{className:"client-info-header",children:[e.jsxs("div",{className:"client-photo-area",children:[i.photo_url?e.jsx("img",{src:i.photo_url,alt:"Foto",className:"client-photo"}):e.jsx("div",{className:"client-photo-placeholder",children:e.jsx("i",{className:"bi bi-person fs-2"})}),E&&e.jsx("div",{className:"client-valid-indicator",children:e.jsx("i",{className:"bi bi-check-circle-fill"})})]}),e.jsxs("div",{className:"client-details",children:[e.jsx("div",{className:"client-name-large",children:i.client_name||"-"}),e.jsxs("div",{className:"client-points-large",children:[e.jsx("span",{className:"points-value",children:i.points||0}),e.jsx("span",{className:"points-label",children:"pontos"})]}),e.jsx("div",{className:"client-card-info",children:e.jsxs("div",{className:"card-number",children:["Cartão: ",e.jsx("span",{children:ee(i.card_number)})]})})]})]}),e.jsxs("div",{className:"client-additional-info",children:[e.jsxs("div",{className:"client-segment-box",children:[e.jsx("div",{className:"segment-label",children:"Segmento"}),e.jsxs("div",{className:`segment-badge-large ${N.class||"bg-secondary"}`,children:[e.jsx("span",{className:"segment-emoji",children:N.emoji||"👤"}),e.jsx("span",{className:"segment-name",children:N.label||"Cliente"})]})]}),e.jsxs("div",{className:"client-visit-info",children:[e.jsxs("div",{className:"visit-date",children:[e.jsx("i",{className:"bi bi-calendar-check"}),e.jsxs("span",{children:["Última visita: ",e.jsx("b",{children:L(i.last_visit)})]})]}),i.next_reward_gap&&i.next_reward_gap.name&&e.jsxs("div",{className:"progress-bar-container",children:[e.jsxs("div",{className:"progress-label",children:["Próximo prêmio: ",e.jsx("b",{children:i.next_reward_gap.name})]}),e.jsx("div",{className:"progress-bar-wrapper",children:e.jsx("div",{className:"progress-bar",style:{width:`${Math.min(100,100-i.next_reward_gap.missing_points/i.next_reward_gap.points_required*100)}%`}})}),e.jsxs("div",{className:"progress-values",children:[e.jsxs("span",{children:["Faltam ",i.next_reward_gap.missing_points," pts"]}),e.jsxs("span",{children:[i.next_reward_gap.points_required," pts"]})]})]})]}),Array.isArray(i.rewards)&&i.rewards.length>0&&e.jsxs("div",{className:"client-notification reward-notification",children:[e.jsx("div",{className:"notification-icon",children:e.jsx("i",{className:"bi bi-gift-fill"})}),e.jsxs("div",{className:"notification-content",children:[e.jsx("div",{className:"notification-title",children:"Prêmios Disponíveis!"}),e.jsxs("div",{className:"notification-text",children:["Cliente tem ",i.rewards.length," prêmio(s) para resgate"]})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
            .client-visor-content {
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 14px;
              color: white;
              overflow-y: auto;
              scrollbar-width: none;
            }
            
            .client-visor-content::-webkit-scrollbar {
              display: none;
            }
            
            /* Área de status/mensagens no topo para feedback */
            .client-status-header {
              margin-bottom: 10px;
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
          `})]}),children:[e.jsxs("div",{className:"px-2",children:[e.jsx("div",{className:a["device-result-panel"],children:e.jsxs("div",{className:a["device-result-header"],children:[e.jsx("div",{className:a["device-result-icon"],style:{color:k.colorClass.replace("text-","")},children:e.jsx("i",{className:`bi ${k.icon}`})}),e.jsxs("div",{children:[e.jsx("h4",{style:{margin:"0 0 4px 0",fontSize:"18px",color:k.colorClass.replace("text-","")},children:k.title}),e.jsx("p",{style:{margin:0,fontSize:"14px",opacity:.9},children:k.message})]})]})}),v==="details"&&e.jsx("div",{className:"tab-content p-2",children:e.jsxs("div",{className:a["device-info-card"],children:[e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Data/Hora"}),e.jsx("div",{className:a["device-info-value"],children:new Date(r.timestamp).toLocaleString()})]}),((H=r.result)==null?void 0:H.scan_id)&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"ID do Scan"}),e.jsx("div",{className:a["device-info-value"],style:{fontSize:"13px",opacity:.8},children:r.result.scan_id})]}),((J=r.result)==null?void 0:J.scan_type)&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Tipo"}),e.jsx("div",{className:a["device-info-value"],children:E?"Cartão de Fidelidade":F?"Cupom":r.result.scan_type})]}),((G=(X=r.result)==null?void 0:X.details)==null?void 0:G.program_name)&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Programa"}),e.jsx("div",{className:a["device-info-value"],children:r.result.details.program_name})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Status"}),e.jsx("div",{className:a["device-info-value"],children:e.jsx("span",{className:`${a["device-badge"]} ${a["device-badge-"+(r.processed?"success":"warning")]}`,children:r.processed?"Processado":"Pendente"})})]}),E&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Pontos"}),e.jsxs("div",{className:a["device-info-value"],children:[e.jsx("span",{className:"fw-bold",style:{color:"#39FF14"},children:i.points||0}),h&&e.jsxs("span",{className:"ms-2 badge bg-success",children:["+",b]})]})]}),F&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Status do Cupom"}),e.jsx("div",{className:a["device-info-value"],children:g?e.jsx("span",{className:"badge bg-success",children:"Resgatado"}):e.jsx("span",{className:"badge bg-primary",children:"Disponível"})})]})]})}),v==="client"&&(E||F)&&e.jsx("div",{className:"tab-content p-2 mt-3",children:e.jsxs("div",{className:a["device-info-card"],children:[e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Nome"}),e.jsx("div",{className:a["device-info-value"],children:i.client_name||"-"})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Cartão"}),e.jsx("div",{className:a["device-info-value"],children:ee(i.card_number)})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Segmento"}),e.jsx("div",{className:a["device-info-value"],children:e.jsxs("span",{className:`badge ${(K=N.class)==null?void 0:K.replace("text-","text-bg-")}`,children:[N.emoji," ",N.label||"Cliente"]})})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Email"}),e.jsx("div",{className:a["device-info-value"],children:i.email||"-"})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Telefone"}),e.jsx("div",{className:a["device-info-value"],children:i.phone||"-"})]}),e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Última Visita"}),e.jsx("div",{className:a["device-info-value"],children:L(i.last_visit)})]}),i.signup_date&&e.jsxs("div",{className:a["device-info-row"],children:[e.jsx("div",{className:a["device-info-label"],children:"Cliente desde"}),e.jsx("div",{className:a["device-info-value"],children:L(i.signup_date)})]})]})}),v==="rewards"&&e.jsxs("div",{className:"tab-content p-2 mt-3",children:[i.next_reward_gap&&i.next_reward_gap.name&&e.jsxs("div",{className:a["device-info-card"],style:{marginBottom:"16px"},children:[e.jsx("h5",{className:"mb-3",children:"Próximo Prêmio"}),e.jsxs("div",{className:"d-flex align-items-center mb-2",children:[e.jsxs("div",{className:"flex-grow-1",children:[e.jsx("div",{className:"fw-bold",children:i.next_reward_gap.name}),e.jsxs("div",{className:"text-muted small",children:["Faltam ",i.next_reward_gap.missing_points," de ",i.next_reward_gap.points_required," pontos"]})]}),e.jsx("div",{className:"ms-3",children:e.jsxs("span",{className:"badge bg-primary",children:[Math.floor((1-i.next_reward_gap.missing_points/i.next_reward_gap.points_required)*100),"%"]})})]}),e.jsx("div",{className:"progress",style:{height:"8px"},children:e.jsx("div",{className:"progress-bar",role:"progressbar",style:{width:`${Math.min(100,100-i.next_reward_gap.missing_points/i.next_reward_gap.points_required*100)}%`,background:"linear-gradient(90deg, #00a3ff, #39FF14)"}})})]}),Array.isArray(i.rewards)&&i.rewards.length>0?e.jsxs("div",{className:a["device-info-card"],children:[e.jsx("h5",{className:"mb-3",children:"Prêmios Disponíveis"}),i.rewards.map((s,o)=>e.jsx("div",{className:"card mb-2",style:{background:"rgba(57, 255, 20, 0.1)",border:"1px solid rgba(57, 255, 20, 0.3)"},children:e.jsx("div",{className:"card-body p-3",children:e.jsxs("div",{className:"d-flex",children:[e.jsx("div",{className:"reward-icon me-3",children:e.jsx("i",{className:"bi bi-gift-fill fs-3",style:{color:"#39FF14"}})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1",children:s.name}),e.jsx("p",{className:"mb-0 small",children:s.description||"Sem descrição disponível"}),s.expiry_date&&e.jsxs("small",{className:"text-muted",children:["Válido até ",new Date(s.expiry_date).toLocaleDateString()]})]})]})})},o))]}):e.jsx("div",{className:"alert alert-info",role:"alert",children:"Não há prêmios disponíveis para resgate no momento."})]})]}),e.jsx(xe,{open:I,onClose:()=>C(!1),type:S,onSubmit:S==="pontos"?s=>{ne(s),C(!1)}:s=>{oe(),C(!1)},loading:S==="pontos"?P:z,clientDetails:i,points:b,setPoints:q,maxPoints:i.operator_max_points||100})]})}export{we as default};
