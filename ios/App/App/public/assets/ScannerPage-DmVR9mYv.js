import{j as s,a as b,u as j,d as v,e as N,r as x,y as p}from"./main-8IGYUPaQ.js";import{S as y}from"./ScannerComponent-0OvRdEkR.js";import{M as w}from"./MainLayout-BTQmRPiH.js";import{V as S}from"./CameraVisor-7z3sIFha.js";import"./pwa-scanner-branco-oh03E7i6.js";function R({currentScan:n,clientDetails:a={},rfmSegment:l={},reward:d={},coupon:c={}}){var e,i,u;return n?s.jsxs("div",{className:"zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3",style:{minHeight:180},children:[s.jsxs("div",{className:"d-flex align-items-center mb-3",children:[a.photo_url?s.jsx("img",{src:a.photo_url,alt:"Foto",style:{width:56,height:56,borderRadius:"50%",objectFit:"cover",marginRight:16,border:"2px solid #444"}}):s.jsx("div",{style:{width:56,height:56,borderRadius:"50%",background:"#222",marginRight:16,display:"flex",alignItems:"center",justifyContent:"center"},children:s.jsx("i",{className:"bi bi-person fs-2 text-secondary"})}),s.jsxs("div",{style:{flex:1},children:[s.jsx("div",{className:"fw-bold fs-5 mb-1",children:a.client_name||"-"}),s.jsxs("div",{className:"small text-light mb-1",children:["Cartão: ",s.jsx("span",{className:"fw-semibold",children:a.card_number||"-"})]}),s.jsxs("div",{className:"small text-light",children:["Aniversário: ",s.jsx("span",{className:"fw-semibold",children:a.birthday||"-"}),"  |  Última visita: ",s.jsx("span",{className:"fw-semibold",children:a.last_visit||"-"})]})]}),s.jsxs("div",{className:"text-end ms-3",children:[s.jsxs("span",{className:`badge ${l.class||"bg-secondary"} px-2 py-1 mb-1`,children:[l.emoji||"👤"," ",l.label||"Segmento"]}),s.jsx("div",{className:"fw-bold fs-6 text-success",children:a.points!=null?`${a.points} pts`:""})]})]}),(((e=n.result)==null?void 0:e.scan_type)==="reward"||((i=n.result)==null?void 0:i.scan_type)==="coupon")&&s.jsxs("div",{className:"d-flex align-items-center justify-content-between mt-2",children:[s.jsxs("div",{children:[s.jsx("div",{className:"fw-bold",children:d.name||c.name||"-"}),s.jsxs("div",{className:"small text-light",children:["Status: ",s.jsx("span",{className:"fw-semibold",children:d.status||c.status||"-"})]})]}),s.jsx("div",{className:"text-end",children:s.jsxs("div",{className:"small text-light",children:["Validade: ",s.jsx("span",{className:"fw-semibold",children:d.valid_until||c.valid_until||"-"})]})})]}),s.jsxs("div",{className:"mt-2 small text-secondary",children:["Código: ",((u=n.result)==null?void 0:u.code)||"-"]})]}):null}function P(){const n=b(),{userData:a,scannerData:l}=j(),{isProcessing:d,processScan:c,currentScan:e}=v(),{isOnline:i,pendingCount:u}=N(),[h,t]=x.useState(!1),[g,r]=x.useState("idle");x.useEffect(()=>{e&&e.processed&&n("/result")},[e,n]),x.useEffect(()=>{console.log("ScannerPage mounted, starting camera automatically"),t(!0),r("scanning"),setTimeout(()=>{const m=document.getElementById("scannerVideo");m&&m.srcObject===null&&(console.log("Forçando reinício da câmera"),t(!1),setTimeout(()=>{t(!0),r("scanning")},300))},500)},[]);const f=async m=>{t(!1),r("processing");try{const o=await c(m);console.log("Scan processado com sucesso:",o),o&&o.processed?setTimeout(()=>{n("/result")},300):i||(p.warning("Você está offline. O scan será processado quando estiver online."),n("/result"))}catch(o){p.error(o.message||"Falha ao processar QR code"),console.error("Erro no processamento:",o),r("idle")}};return s.jsx(w,{title:"Scanner",activeMenu:"scanner",visor:s.jsx(S,{mode:g,onToggleScanner:()=>{h?(t(!1),r("idle")):(t(!0),r("scanning"))},children:g==="processing"&&(!e||!e.result)?s.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center w-100 h-100",style:{minHeight:120},children:[s.jsx("div",{className:"spinner-border text-warning mb-3",role:"status"}),s.jsx("div",{className:"fw-bold text-warning fs-5",children:"QR Code detectado! Processando..."})]}):e&&(e.result||e.processed)?s.jsx(R,{currentScan:e,clientDetails:e.clientDetails||{},rfmSegment:e.rfmSegment||{},reward:e.reward||{},coupon:e.coupon||{}}):g==="scanning"&&s.jsx(y,{onQrScanned:f})}),children:s.jsxs("div",{className:"scanner-info-box",children:[s.jsxs("div",{className:"scan-instructions",children:[s.jsx("div",{className:"instruction-icon",children:s.jsx("i",{className:"bi bi-qr-code-scan"})}),s.jsx("div",{className:"instruction-text",children:"Posicione o código QR no centro da câmera"})]}),s.jsx("div",{className:`scanner-status ${i?"online":"offline"}`,children:i?"Scanner Online":"Scanner Offline"}),s.jsx("style",{jsx:!0,children:`
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
