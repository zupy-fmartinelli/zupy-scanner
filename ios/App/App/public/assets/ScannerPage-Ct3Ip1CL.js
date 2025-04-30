import{j as s,a as h,u as j,d as y,e as N,r as m,y as v}from"./main-C91a_6nM.js";import{S}from"./ScannerComponent-Cz0sCgD2.js";import{M as w,V as _}from"./CameraVisor-DPQ9fBAt.js";import"./PwaInstallPrompt-DGbz7qAF.js";import"./pwa-scanner-branco-oh03E7i6.js";function R({currentScan:t,clientDetails:e={},rfmSegment:f={},reward:b={},coupon:g={},finalized:n=!1,addedPoints:o=0}){var d;if(!t)return null;const x=e.user_photo_url||e.photo_url,l=e.client_name||e.user_name||"-",r=e.points!=null?e.points:e.current_points!=null?e.current_points:"-",c=e.card_number||"-",i=typeof e.rfm=="string"?e.rfm:e.rfm&&e.rfm.label?e.rfm.label:"Segmento",p=e.last_visit?new Date(e.last_visit).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-",a=e.next_reward_gap;return s.jsxs("div",{className:"zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3",style:{minHeight:180},children:[n&&o>0&&s.jsxs("span",{className:"badge bg-success px-3 py-2 fs-6 d-inline-flex align-items-center mb-2",style:{fontWeight:600,fontSize:"1rem"},children:[s.jsx("i",{className:"bi bi-coin me-2",style:{fontSize:18,color:"#ffd700"}}),"+",o," pontos adicionados para ",s.jsx("b",{className:"ms-1",children:l})]}),s.jsxs("div",{className:"d-flex align-items-center mb-3",children:[x?s.jsx("img",{src:x,alt:"Foto",style:{width:56,height:56,borderRadius:"50%",objectFit:"cover",marginRight:16,border:"2px solid #444"}}):s.jsx("div",{style:{width:56,height:56,borderRadius:"50%",background:"#222",marginRight:16,display:"flex",alignItems:"center",justifyContent:"center"},children:s.jsx("i",{className:"bi bi-person fs-2 text-secondary"})}),s.jsxs("div",{style:{flex:1},children:[s.jsx("div",{className:"fw-bold fs-5 mb-1",children:l}),s.jsxs("div",{className:"fw-bold fs-4 mb-1 text-success",children:[r," ",s.jsx("span",{style:{fontSize:16},children:"pontos"})]}),s.jsxs("div",{className:"small text-light mb-1",children:["Cartão: ",s.jsx("span",{className:"fw-semibold",children:c})]})]}),s.jsx("div",{className:"text-end ms-3",children:s.jsx("span",{className:"badge bg-primary px-2 py-1 mb-1",children:i})})]}),s.jsx("div",{className:"mb-2",children:s.jsx("span",{className:"badge bg-success px-3 py-2 fs-6",children:"Cliente identificado"})}),s.jsxs("div",{className:"d-flex flex-wrap align-items-center mb-2 gap-3",children:[s.jsxs("div",{className:"small text-light",children:["Última visita: ",s.jsx("span",{className:"fw-semibold",children:p})]}),a&&s.jsxs("div",{className:"small text-light",children:["Próximo prêmio: ",s.jsx("span",{className:"fw-semibold",children:a.name})," (faltam ",s.jsx("span",{className:"fw-semibold",children:a.missing_points})," pts)"]})]}),s.jsxs("div",{className:"mt-2 small text-secondary",children:["Código: ",((d=t.result)==null?void 0:d.code)||"-"]})]})}function P(){const t=h(),{userData:e,scannerData:f}=j(),{isProcessing:b,processScan:g,currentScan:n}=y(),{isOnline:o,pendingCount:x}=N(),[l,r]=m.useState(!1),[c,i]=m.useState("idle");m.useEffect(()=>{n&&n.processed&&t("/result")},[n,t]),m.useEffect(()=>{console.log("ScannerPage mounted, starting camera automatically"),r(!0),i("scanning"),setTimeout(()=>{const a=document.getElementById("scannerVideo");a&&a.srcObject===null&&(console.log("Forçando reinício da câmera"),r(!1),setTimeout(()=>{r(!0),i("scanning")},300))},500)},[]);const p=async a=>{r(!1),i("processing");const d=typeof a=="object"?a:{qrData:a};try{await g(d),console.log("Chamada a processScan concluída.")}catch(u){v.error(u.message||"Falha ao processar QR code"),console.error("Erro no processamento:",u),i("idle")}};return s.jsx(w,{title:"Scanner",activeMenu:"scanner",visor:s.jsx(_,{mode:c,onToggleScanner:()=>{l?(r(!1),i("idle")):(r(!0),i("scanning"))},children:c==="processing"&&(!n||!n.result)?s.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center w-100 h-100",style:{minHeight:120},children:[s.jsx("div",{className:"spinner-border text-warning mb-3",role:"status"}),s.jsx("div",{className:"fw-bold text-warning fs-5",children:"QR Code detectado! Processando..."})]}):n&&(n.result||n.processed)?s.jsx(R,{currentScan:n,clientDetails:n.clientDetails||{},rfmSegment:n.rfmSegment||{},reward:n.reward||{},coupon:n.coupon||{}}):c==="scanning"&&s.jsx(S,{onQrScanned:p})}),children:s.jsxs("div",{className:"scanner-info-box",children:[s.jsxs("div",{className:"scan-instructions",children:[s.jsx("div",{className:"instruction-icon",children:s.jsx("i",{className:"bi bi-qr-code-scan"})}),s.jsx("div",{className:"instruction-text",children:"Posicione o código QR no centro da câmera"})]}),s.jsx("div",{className:`scanner-status ${o?"online":"offline"}`,children:o?"Scanner Online":"Scanner Offline"}),s.jsx("style",{jsx:!0,children:`
          .scanner-info-box {
            padding: 20px;
            background: rgba(0,0,0,0.1);
            border-radius: 16px;
            margin: 20px 12px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          }
          
          .scan-instructions {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .instruction-icon {
            font-size: 24px;
            margin-right: 12px;
            color: #00e3ff;
            background: rgba(0, 227, 255, 0.1);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .instruction-text {
            font-size: 16px;
            color: #e0e0e0;
          }
          
          .scanner-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            font-size: 15px;
            margin-top: 12px;
          }
          
          .scanner-status.online {
            background: rgba(40, 167, 69, 0.15);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.3);
          }
          
          .scanner-status.offline {
            background: rgba(220, 53, 69, 0.15);
            color: #dc3545;
            border: 1px solid rgba(220, 53, 69, 0.3);
          }
        `})]})})}export{P as default};
