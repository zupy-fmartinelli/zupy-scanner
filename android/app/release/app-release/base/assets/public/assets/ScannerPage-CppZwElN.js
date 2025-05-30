import{j as e,a as h,u as j,d as y,e as N,r as m,y as S}from"./main-N4Ha74AW.js";import{S as v}from"./ScannerComponent-COi_j_9w.js";import{M as w,V as _}from"./CameraVisor-CymAgDiC.js";import"./PwaInstallPrompt-D9QMSuU2.js";import"./pwa-scanner-branco-oh03E7i6.js";function R({currentScan:o,clientDetails:s={},rfmSegment:f={},reward:b={},coupon:p={},finalized:n=!1,addedPoints:c=0}){var t;if(!o)return null;const x=s.user_photo_url||s.photo_url,d=s.client_name||s.user_name||"-",r=s.points!=null?s.points:s.current_points!=null?s.current_points:"-",l=s.card_number||"-",i=typeof s.rfm=="string"?s.rfm:s.rfm&&s.rfm.label?s.rfm.label:"Segmento",g=s.last_visit?new Date(s.last_visit).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-",a=s.next_reward_gap;return e.jsxs("div",{className:"zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3",style:{minHeight:180},children:[n&&c>0&&e.jsxs("span",{className:"badge bg-success px-3 py-2 fs-6 d-inline-flex align-items-center mb-2",style:{fontWeight:600,fontSize:"1rem"},children:[e.jsx("i",{className:"bi bi-coin me-2",style:{fontSize:18,color:"#ffd700"}}),"+",c," pontos adicionados para ",e.jsx("b",{className:"ms-1",children:d})]}),e.jsxs("div",{className:"d-flex align-items-center mb-3",children:[x?e.jsx("img",{src:x,alt:"Foto",style:{width:56,height:56,borderRadius:"50%",objectFit:"cover",marginRight:16,border:"2px solid #444"}}):e.jsx("div",{style:{width:56,height:56,borderRadius:"50%",background:"#222",marginRight:16,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("i",{className:"bi bi-person fs-2 text-secondary"})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{className:"fw-bold fs-5 mb-1",children:d}),e.jsxs("div",{className:"fw-bold fs-4 mb-1 text-success",children:[r," ",e.jsx("span",{style:{fontSize:16},children:"pontos"})]}),e.jsxs("div",{className:"small text-light mb-1",children:["Cartão: ",e.jsx("span",{className:"fw-semibold",children:l})]})]}),e.jsx("div",{className:"text-end ms-3",children:e.jsx("span",{className:"badge bg-primary px-2 py-1 mb-1",children:i})})]}),e.jsx("div",{className:"mb-2",children:e.jsx("span",{className:"badge bg-success px-3 py-2 fs-6",children:"Cliente identificado"})}),e.jsxs("div",{className:"d-flex flex-wrap align-items-center mb-2 gap-3",children:[e.jsxs("div",{className:"small text-light",children:["Última visita: ",e.jsx("span",{className:"fw-semibold",children:g})]}),a&&e.jsxs("div",{className:"small text-light",children:["Próximo prêmio: ",e.jsx("span",{className:"fw-semibold",children:a.name})," (faltam ",e.jsx("span",{className:"fw-semibold",children:a.missing_points})," pts)"]})]}),e.jsxs("div",{className:"mt-2 small text-secondary",children:["Código: ",((t=o.result)==null?void 0:t.code)||"-"]})]})}function P(){const o=h(),{userData:s,scannerData:f}=j(),{isProcessing:b,processScan:p,currentScan:n}=y(),{isOnline:c,pendingCount:x}=N(),[d,r]=m.useState(!1),[l,i]=m.useState("idle");m.useEffect(()=>{n&&n.processed&&o("/result")},[n,o]),m.useEffect(()=>{console.log("ScannerPage mounted, starting camera automatically"),r(!0),i("scanning"),setTimeout(()=>{const a=document.getElementById("scannerVideo");a&&a.srcObject===null&&(console.log("Forçando reinício da câmera"),r(!1),setTimeout(()=>{r(!0),i("scanning")},300))},500)},[]);const g=async a=>{r(!1),i("processing");let t=a;typeof a=="object"&&a!==null&&(t=a.qrData||a.code||JSON.stringify(a)),typeof t!="string"&&(t=String(t));try{await p(t),console.log("Chamada a processScan concluída.")}catch(u){S.error(u.message||"Falha ao processar QR code"),console.error("Erro no processamento:",u),i("idle")}};return e.jsx(w,{title:"Scanner",activeMenu:"scanner",visor:e.jsx(_,{mode:l,onToggleScanner:()=>{d?(r(!1),i("idle")):(r(!0),i("scanning"))},children:l==="processing"&&(!n||!n.result)?e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center w-100 h-100",style:{minHeight:120},children:[e.jsx("div",{className:"spinner-border text-warning mb-3",role:"status"}),e.jsx("div",{className:"fw-bold text-warning fs-5",children:"QR Code detectado! Processando..."})]}):n&&(n.result||n.processed)?e.jsx(R,{currentScan:n,clientDetails:n.clientDetails||{},rfmSegment:n.rfmSegment||{},reward:n.reward||{},coupon:n.coupon||{}}):l==="scanning"&&e.jsx(v,{onQrScanned:g})}),children:e.jsxs("div",{className:"scanner-info-box",children:[e.jsxs("div",{className:"scan-instructions",children:[e.jsx("div",{className:"instruction-icon",children:e.jsx("i",{className:"bi bi-qr-code-scan"})}),e.jsx("div",{className:"instruction-text",children:"Posicione o código QR no centro da câmera"})]}),e.jsx("div",{className:`scanner-status ${c?"online":"offline"}`,children:c?"Scanner Online":"Scanner Offline"}),e.jsx("style",{jsx:!0,children:`
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
